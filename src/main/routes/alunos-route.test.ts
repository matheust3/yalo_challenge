import * as PrismaClient from '../../../ci/prisma-client'
import { Express } from 'express'
import supertest from 'supertest'
import { IAluno } from '../../domain/models/IAluno'

// Mock the PrismaClient singleton
jest.mock('@prisma/client', () => PrismaClient)

describe('alunos-route.test.ts - delete', () => {
  let app: Express
  let prismaClient: PrismaClient.PrismaClient
  let aluno: IAluno

  const createAluno = async (aluno: IAluno): Promise<IAluno> => {
    const result = await supertest(app).post('/api/alunos').send(aluno)
    expect(result.status).toBe(201)
    expect(result.body).toEqual(aluno)
    return result.body
  }

  beforeAll(async () => {
    // Inicializa os servidor com um banco de dados fake
    app = (await import('../config/app')).default
    prismaClient = new PrismaClient.PrismaClient()
  })

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prismaClient.alunos.deleteMany()

    aluno = {
      id: 1,
      name: 'Aluno 1',
      email: 'email@domain.com',
      cpf: '12345678901',
      id_colegio: 1,
      id_turma: 1,
      score: 0
    }
  })

  test('ensure create aluno works', async () => {
    //! Arrange
    //! Act
    const alunoCreated = await createAluno(aluno)
    //! Assert
    expect(alunoCreated).toEqual(aluno)
  })

  test('ensure delete aluno by id works', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    //! Act
    const result = await supertest(app).delete(`/api/alunos?id=${alunoCreated.id}`)
    //! Assert
    expect(result.body).toEqual({})
    expect(result.status).toBe(204)
  })

  test('ensure delete aluno by cpf works', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    //! Act
    const result = await supertest(app).delete(`/api/alunos?cpf=${alunoCreated.cpf}`)
    //! Assert
    expect(result.body).toEqual({})
    expect(result.status).toBe(204)
  })

  test('ensure return error if aluno not exists', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).delete(`/api/alunos?id=${aluno.id}`)
    //! Assert
    expect(result.body).toEqual({ message: 'Aluno not found' })
    expect(result.status).toBe(404)
  })

  test('ensure return error if params is not provided', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).delete('/api/alunos')
    //! Assert
    expect(result.body).toEqual({ message: '"id" or "cpf" is required' })
    expect(result.status).toBe(400)
  })
})

describe('alunos-route.test.ts - get', () => {
  let app: Express
  let prismaClient: PrismaClient.PrismaClient
  let aluno: IAluno

  const createAluno = async (aluno: IAluno): Promise<IAluno> => {
    const result = await supertest(app).post('/api/alunos').send(aluno)
    expect(result.status).toBe(201)
    expect(result.body).toEqual(aluno)
    return result.body
  }

  beforeAll(async () => {
    // Inicializa os servidor com um banco de dados fake
    app = (await import('../config/app')).default
    prismaClient = new PrismaClient.PrismaClient()
  })

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prismaClient.alunos.deleteMany()

    aluno = {
      id: 1,
      name: 'Aluno 1',
      email: 'email@domain.com',
      cpf: '12345678901',
      id_colegio: 1,
      id_turma: 1,
      score: 0
    }
  })

  test('ensure create aluno works', async () => {
    //! Arrange
    //! Act
    const alunoCreated = await createAluno(aluno)
    //! Assert
    expect(alunoCreated).toEqual(aluno)
  })

  test('ensure list all alunos', async () => {
    //! Arrange
    const a1 = await createAluno(aluno)
    const a2 = await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    const a3 = await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 8, name: 'Aluno 3', id_colegio: 3, id_turma: 3 })
    //! Act
    const result = await supertest(app).get('/api/alunos')
    //! Assert
    expect(result.body).toEqual([a1, a2, a3])
  })

  test('ensure list all alunos sorted by id', async () => {
    //! Arrange
    const a3 = await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 8, name: 'Aluno 3', id_colegio: 3, id_turma: 3 })
    const a2 = await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    const a1 = await createAluno(aluno)
    //! Act
    const result = await supertest(app).get('/api/alunos')
    //! Assert
    expect(result.body).toEqual([a1, a2, a3])
  })

  test('ensure filter by id_colegio', async () => {
    //! Arrange
    await createAluno(aluno)
    await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    const a3 = await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 8, name: 'Aluno 3', id_colegio: 3, id_turma: 3 })
    const a4 = await createAluno({ ...aluno, id: 4, cpf: '12345678904', score: 8, name: 'Aluno 4', id_colegio: 3, id_turma: 4 })
    //! Act
    const result = await supertest(app).get('/api/alunos?id_colegio=3')
    //! Assert
    expect(result.body).toEqual([a3, a4])
  })

  test('ensure filter by id_turma', async () => {
    //! Arrange
    await createAluno(aluno)
    await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    const a3 = await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 8, name: 'Aluno 3', id_colegio: 3, id_turma: 3 })
    const a4 = await createAluno({ ...aluno, id: 4, cpf: '12345678904', score: 8, name: 'Aluno 4', id_colegio: 4, id_turma: 3 })
    //! Act
    const result = await supertest(app).get('/api/alunos?id_turma=3')
    //! Assert
    expect(result.body).toEqual([a3, a4])
  })

  test('ensure filter by score', async () => {
    //! Arrange
    await createAluno(aluno)
    await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    const a3 = await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 4, name: 'Aluno 3', id_colegio: 3, id_turma: 3 })
    const a4 = await createAluno({ ...aluno, id: 4, cpf: '12345678904', score: 4, name: 'Aluno 4', id_colegio: 4, id_turma: 4 })
    //! Act
    const result = await supertest(app).get('/api/alunos?score=4')
    //! Assert
    expect(result.body).toEqual([a3, a4])
  })

  test('ensure filter by multiple params', async () => {
    //! Arrange
    await createAluno(aluno)
    const a2 = await createAluno({ ...aluno, id: 2, cpf: '12345678902', score: 9, name: 'Aluno 2', id_colegio: 2, id_turma: 2 })
    await createAluno({ ...aluno, id: 3, cpf: '12345678903', score: 9, name: 'Aluno 3', id_colegio: 2, id_turma: 3 })
    await createAluno({ ...aluno, id: 4, cpf: '12345678904', score: 9, name: 'Aluno 4', id_colegio: 3, id_turma: 2 })
    //! Act
    const result = await supertest(app).get('/api/alunos?score=9&id_colegio=2&id_turma=2')
    //! Assert
    expect(result.body).toEqual([a2])
  })

  test('ensure return error if invalid param', async () => {
    //! Arrange
    await createAluno(aluno)
    //! Act
    const result = await supertest(app).get('/api/alunos?id=4')
    //! Assert
    expect(result.status).toBe(400)
    expect(result.body).toEqual({ message: '"id" is not allowed' })
  })

  test('ensure return empty if not has alunos in db', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).get('/api/alunos')
    //! Assert
    expect(result.body).toEqual([])
  })
})

describe('alunos-route.test.ts - post', () => {
  let app: Express
  let prismaClient: PrismaClient.PrismaClient
  let aluno: IAluno

  beforeAll(async () => {
    // Inicializa os servidor com um banco de dados fake
    app = (await import('../config/app')).default
    prismaClient = new PrismaClient.PrismaClient()
  })

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prismaClient.alunos.deleteMany()

    aluno = {
      id: 1,
      name: 'Aluno 1',
      email: 'email@domain.com',
      cpf: '12345678901',
      id_colegio: 1,
      id_turma: 1,
      score: 0
    }
  })

  test('ensure create a aluno and return 201', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual(aluno)
    expect(result.status).toBe(201)
  })

  test('ensure not create two alunos with same cpf', async () => {
    //! Arrange
    const aluno2 = { ...aluno, id: 2 }
    //! Act
    const result1 = await supertest(app).post('/api/alunos').send(aluno)
    const result2 = await supertest(app).post('/api/alunos').send(aluno2)
    //! Assert
    expect(result1.body).toEqual(aluno)
    expect(result1.status).toBe(201)
    expect(result2.body).toEqual({ message: 'cpf is already in use' })
    expect(result2.status).toBe(409)
  })

  test('ensure not create two alunos with same ids', async () => {
    //! Arrange
    const aluno2 = { ...aluno, cpf: '12345678902' }
    //! Act
    const result1 = await supertest(app).post('/api/alunos').send(aluno)
    const result2 = await supertest(app).post('/api/alunos').send(aluno2)
    //! Assert
    expect(result1.body).toEqual(aluno)
    expect(result1.status).toBe(201)
    expect(result2.body).toEqual({ message: 'id is already in use' })
    expect(result2.status).toBe(409)
  })

  test('ensure create a aluno without name, email and score', async () => {
    //! Arrange
    delete aluno.name
    delete aluno.email
    delete aluno.score
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual(aluno)
    expect(result.status).toBe(201)
  })

  test('ensure not create a aluno with invalid cpf', async () => {
    //! Arrange
    aluno.cpf = '1234567890'
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual({ message: '"cpf" length must be 11 characters long' })
    expect(result.status).toBe(400)
  })

  test('ensure not create a aluno with invalid id_colegio', async () => {
    //! Arrange
    aluno.id_colegio = 0
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual({ message: '"id_colegio" must be a positive number' })
    expect(result.status).toBe(400)
  })

  test('ensure not create a aluno with invalid id_turma', async () => {
    //! Arrange
    aluno.id_turma = 0
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual({ message: '"id_turma" must be a positive number' })
    expect(result.status).toBe(400)
  })

  test('ensure id is required', async () => {
    //! Arrange
    const alunoWithoutId: object & { id?: number } = { ...aluno }
    delete alunoWithoutId.id
    //! Act
    const result = await supertest(app).post('/api/alunos').send(alunoWithoutId)
    //! Assert
    expect(result.body).toEqual({ message: '"id" is required' })
    expect(result.status).toBe(400)
  })
  test('ensure cpf is required', async () => {
    //! Arrange
    const alunoWithoutCpf: object & { cpf?: string } = { ...aluno }
    delete alunoWithoutCpf.cpf
    //! Act
    const result = await supertest(app).post('/api/alunos').send(alunoWithoutCpf)
    //! Assert
    expect(result.body).toEqual({ message: '"cpf" is required' })
    expect(result.status).toBe(400)
  })
  test('ensure id_colegio is required', async () => {
    //! Arrange
    const alunoWithoutIdColegio: object & { id_colegio?: number } = { ...aluno }
    delete alunoWithoutIdColegio.id_colegio
    //! Act
    const result = await supertest(app).post('/api/alunos').send(alunoWithoutIdColegio)
    //! Assert
    expect(result.body).toEqual({ message: '"id_colegio" is required' })
    expect(result.status).toBe(400)
  })
  test('ensure id_turma is required', async () => {
    //! Arrange
    const alunoWithoutIdTurma: object & { id_turma?: number } = { ...aluno }
    delete alunoWithoutIdTurma.id_turma
    //! Act
    const result = await supertest(app).post('/api/alunos').send(alunoWithoutIdTurma)
    //! Assert
    expect(result.body).toEqual({ message: '"id_turma" is required' })
    expect(result.status).toBe(400)
  })
})

describe('alunos-route.test.ts - put', () => {
  let app: Express
  let prismaClient: PrismaClient.PrismaClient
  let aluno: IAluno

  const createAluno = async (aluno: IAluno): Promise<IAluno> => {
    const result = await supertest(app).post('/api/alunos').send(aluno)
    expect(result.status).toBe(201)
    expect(result.body).toEqual(aluno)
    return result.body
  }

  beforeAll(async () => {
    // Inicializa os servidor com um banco de dados fake
    app = (await import('../config/app')).default
    prismaClient = new PrismaClient.PrismaClient()
  })

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prismaClient.alunos.deleteMany()

    aluno = {
      id: 1,
      name: 'Aluno 1',
      email: 'email@domain.com',
      cpf: '12345678901',
      id_colegio: 1,
      id_turma: 1,
      score: 0
    }
  })

  test('ensure create aluno works', async () => {
    //! Arrange
    //! Act
    const alunoCreated = await createAluno(aluno)
    //! Assert
    expect(alunoCreated).toEqual(aluno)
  })

  test('ensure update aluno', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    const alunoUpdated: IAluno = {
      id: alunoCreated.id,
      cpf: '12345678902',
      name: 'Aluno 2',
      email: 'email2@d.com',
      id_colegio: 2,
      id_turma: 2,
      score: 10
    }
    //! Act
    const result = await supertest(app).put('/api/alunos').send(alunoUpdated)
    //! Assert
    expect(result.body).toEqual(alunoUpdated)
    expect(result.status).toBe(200)
  })

  test('ensure return error if aluno not exists', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).put('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual({ message: 'aluno not found' })
    expect(result.status).toBe(404)
  })

  test('ensure not change aluno if data not change', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    //! Act
    const result = await supertest(app).put('/api/alunos').send(alunoCreated)
    //! Assert
    expect(result.body).toEqual(alunoCreated)
    expect(result.status).toBe(200)
  })

  test('ensure cpf conflict check', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    await createAluno({ ...aluno, id: 2, cpf: '12345678902' })
    //! Act
    const result = await supertest(app).put('/api/alunos').send({ ...alunoCreated, cpf: '12345678902' })
    //! Assert
    expect(result.body).toEqual({ message: 'cpf is already in use by another aluno' })
    expect(result.status).toBe(409)
  })
})
