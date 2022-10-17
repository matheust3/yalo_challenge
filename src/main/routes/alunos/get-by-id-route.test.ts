import * as PrismaClient from '../../../../ci/prisma-client'
import { Express } from 'express'
import supertest from 'supertest'
import { IAluno } from '../../../domain/models/IAluno'

// Mock the PrismaClient singleton
jest.mock('@prisma/client', () => PrismaClient)

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
    app = (await import('../../config/app')).default
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

  test('ensure get aluno by id works', async () => {
    //! Arrange
    const alunoCreated = await createAluno(aluno)
    //! Act
    const result = await supertest(app).get(`/api/alunos/get-by-id?id=${alunoCreated.id}`)
    //! Assert
    expect(result.status).toBe(200)
    expect(result.body).toEqual(alunoCreated)
  })

  test('ensure return 404 if aluno not fount', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).get('/api/alunos/get-by-id?id=1')
    //! Assert
    expect(result.status).toBe(404)
    expect(result.body).toEqual({ message: 'Aluno not found' })
  })
})
