import { AlunoRepository } from './AlunoRepository'
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended'
import { Alunos, PrismaClient } from '../../../prisma-client'
import { IAluno } from '../../domain/models/IAluno'
import { Decimal } from '../../../prisma-client/runtime'

interface SutTypes {
  sut: AlunoRepository
  prismaClient: DeepMockProxy<PrismaClient> & PrismaClient
  aluno: MockProxy<IAluno> & IAluno
}

const makeSut = (): SutTypes => {
  const prismaClient = mockDeep<PrismaClient>()

  const sut = new AlunoRepository(prismaClient)

  const aluno = mock<IAluno>({
    id: 1,
    cpf: '12345678901',
    email: 'email',
    id_colegio: 1,
    id_turma: 1,
    name: 'name',
    score: 1
  })

  return { sut, prismaClient, aluno }
}

describe('AlunoRepository.spec.ts - create', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, prismaClient, aluno } = makeSut())

    prismaClient.alunos.create.mockResolvedValue({
      id: aluno.id,
      cpf: aluno.cpf,
      name: aluno.name ?? 'name',
      email: aluno.email ?? 'name',
      id_colegio: aluno.id_colegio,
      id_turma: aluno.id_turma,
      score: new Decimal(1)
    })
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.create(aluno)
    //! Assert
    expect(prismaClient.alunos.create).toBeCalledWith({
      data: {
        id: aluno.id,
        cpf: aluno.cpf,
        name: aluno.name,
        email: aluno.email,
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: aluno.score
      }
    })
  })

  test('ensure return created data', async () => {
    //! Arrange
    const expectedAluno = { ...aluno, ...{ _isMockObject: undefined } }
    delete expectedAluno._isMockObject
    //! Act
    const result = await sut.create(aluno)
    //! Assert
    expect(result).toEqual(expectedAluno)
  })

  test('ensure return aluno without name if prisma return name null', async () => {
    //! Arrange
    prismaClient.alunos.create.mockResolvedValueOnce(mock<Alunos>({ name: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.create(aluno)
    //! Assert
    expect(result.name).toBeUndefined()
  })

  test('ensure return aluno without email if prisma return email null', async () => {
    //! Arrange
    prismaClient.alunos.create.mockResolvedValueOnce(mock<Alunos>({ email: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.create(aluno)
    //! Assert
    expect(result.email).toBeUndefined()
  })

  test('ensure return aluno without score if prisma return score null', async () => {
    //! Arrange
    prismaClient.alunos.create.mockResolvedValueOnce(mock<Alunos>({ score: null }))
    //! Act
    const result = await sut.create(aluno)
    //! Assert
    expect(result.score).toBeUndefined()
  })

  test('ensure throws if prisma throws', async () => {
    //! Arrange
    const error = new Error('error')
    prismaClient.alunos.create.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(sut.create(aluno)).rejects.toThrowError(error)
  })
})

describe('AlunoRepository.spec.ts - delete', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']

  beforeEach(() => {
    ({ sut, prismaClient } = makeSut())
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.delete(12)
    //! Assert
    expect(prismaClient.alunos.delete).toBeCalledWith({
      where: { id: 12 }
    })
  })

  test('ensure throws if prisma throws', async () => {
    //! Arrange
    const error = new Error('error')
    prismaClient.alunos.delete.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(sut.delete(12)).rejects.toThrowError(error)
  })
})
describe('AlunoRepository.spec.ts - find', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, prismaClient, aluno } = makeSut())

    prismaClient.alunos.findMany.mockResolvedValue([
      {
        id: aluno.id,
        cpf: aluno.cpf,
        name: aluno.name ?? 'name',
        email: aluno.email ?? 'name',
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: new Decimal(1)
      }
    ])
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.find({
      id: aluno.id,
      cpf: aluno.cpf,
      idColegio: aluno.id_colegio,
      idTurma: aluno.id_turma,
      score: aluno.score
    })
    //! Assert
    expect(prismaClient.alunos.findMany).toBeCalledWith({
      where: {
        cpf: '12345678901',
        id: 1,
        id_colegio: 1,
        id_turma: 1,
        score: 1
      }
    })
  })

  test('ensure return aluno without name if prisma return name null', async () => {
    //! Arrange
    prismaClient.alunos.findMany.mockResolvedValueOnce([mock<Alunos>({ name: null, score: new Decimal(1) })])
    //! Act
    const result = await sut.find({})
    //! Assert
    expect(result[0]?.name).toBeUndefined()
  })

  test('ensure return aluno without email if prisma return email null', async () => {
    //! Arrange
    prismaClient.alunos.findMany.mockResolvedValueOnce([mock<Alunos>({ email: null, score: new Decimal(1) })])
    //! Act
    const result = await sut.find({})
    //! Assert
    expect(result[0]?.email).toBeUndefined()
  })

  test('ensure return aluno without score if prisma return score null', async () => {
    //! Arrange
    prismaClient.alunos.findMany.mockResolvedValueOnce([mock<Alunos>({ score: null })])
    //! Act
    const result = await sut.find({})
    //! Assert
    expect(result[0]?.score).toBeUndefined()
  })

  test('ensure return result', async () => {
    //! Arrange
    const expectedAluno = { ...aluno, ...{ _isMockObject: undefined } }
    delete expectedAluno._isMockObject
    //! Act
    const alunos = await sut.find({})
    //! Assert
    expect(alunos).toEqual([expectedAluno])
  })

  test('ensure throws if prisma throws', async () => {
    //! Arrange
    const error = new Error('error')
    prismaClient.alunos.findMany.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(sut.find({})).rejects.toThrowError(error)
  })
})

describe('AlunoRepository.spec.ts - getAluno', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, prismaClient, aluno } = makeSut())

    prismaClient.alunos.findFirst.mockResolvedValue(
      {
        id: aluno.id,
        cpf: aluno.cpf,
        name: aluno.name ?? 'name',
        email: aluno.email ?? 'name',
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: new Decimal(1)
      }
    )
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.getAluno({
      id: aluno.id,
      cpf: aluno.cpf
    })
    //! Assert
    expect(prismaClient.alunos.findFirst).toBeCalledWith({
      where: {
        cpf: '12345678901',
        id: 1
      }
    })
  })

  test('ensure return aluno without name if prisma return name null', async () => {
    //! Arrange
    prismaClient.alunos.findFirst.mockResolvedValueOnce(mock<Alunos>({ name: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.getAluno({})
    //! Assert
    expect(result?.name).toBeUndefined()
  })

  test('ensure return aluno without email if prisma return email null', async () => {
    //! Arrange
    prismaClient.alunos.findFirst.mockResolvedValueOnce(mock<Alunos>({ email: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.getAluno({})
    //! Assert
    expect(result?.email).toBeUndefined()
  })

  test('ensure return aluno without score if prisma return score null', async () => {
    //! Arrange
    prismaClient.alunos.findFirst.mockResolvedValueOnce(mock<Alunos>({ score: null }))
    //! Act
    const result = await sut.getAluno({})
    //! Assert
    expect(result?.score).toBeUndefined()
  })

  test('ensure return result', async () => {
    //! Arrange
    const expectedAluno = { ...aluno, ...{ _isMockObject: undefined } }
    delete expectedAluno._isMockObject
    //! Act
    const result = await sut.getAluno({})
    //! Assert
    expect(result).toEqual(expectedAluno)
  })

  test('ensure return undefined if aluno not found', async () => {
    //! Arrange
    prismaClient.alunos.findFirst.mockResolvedValueOnce(null)
    //! Act
    const result = await sut.getAluno({})
    //! Assert
    expect(result).toBeUndefined()
  })

  test('ensure throws if prisma throws', async () => {
    //! Arrange
    const error = new Error('error')
    prismaClient.alunos.findFirst.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(sut.getAluno({})).rejects.toThrowError(error)
  })
})

describe('AlunoRepository.spec.ts - update', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, prismaClient, aluno } = makeSut())

    prismaClient.alunos.update.mockResolvedValue(
      {
        id: aluno.id,
        cpf: aluno.cpf,
        name: aluno.name ?? 'name',
        email: aluno.email ?? 'name',
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: new Decimal(1)
      }
    )
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.update(aluno)
    //! Assert
    expect(prismaClient.alunos.update).toBeCalledWith({
      where: { id: aluno.id },
      data: {
        cpf: aluno.cpf,
        name: aluno.name,
        email: aluno.email,
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: aluno.score
      }
    })
  })

  test('ensure call prisma with nulls if data is undefined', async () => {
    //! Arrange
    //! Act
    await sut.update({ ...aluno, email: undefined, name: undefined, score: undefined })
    //! Assert
    expect(prismaClient.alunos.update).toBeCalledWith({
      where: { id: aluno.id },
      data: {
        cpf: aluno.cpf,
        name: null,
        email: null,
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: null
      }
    })
  })

  test('ensure return aluno without name if prisma return name null', async () => {
    //! Arrange
    prismaClient.alunos.update.mockResolvedValueOnce(mock<Alunos>({ name: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.update(aluno)
    //! Assert
    expect(result?.name).toBeUndefined()
  })

  test('ensure return aluno without email if prisma return email null', async () => {
    //! Arrange
    prismaClient.alunos.update.mockResolvedValueOnce(mock<Alunos>({ email: null, score: new Decimal(1) }))
    //! Act
    const result = await sut.update(aluno)
    //! Assert
    expect(result?.email).toBeUndefined()
  })

  test('ensure return aluno without score if prisma return score null', async () => {
    //! Arrange
    prismaClient.alunos.update.mockResolvedValueOnce(mock<Alunos>({ score: null }))
    //! Act
    const result = await sut.update(aluno)
    //! Assert
    expect(result?.score).toBeUndefined()
  })

  test('ensure return result', async () => {
    //! Arrange
    const expectedAluno = { ...aluno, ...{ _isMockObject: undefined } }
    delete expectedAluno._isMockObject
    //! Act
    const result = await sut.update(aluno)
    //! Assert
    expect(result).toEqual(expectedAluno)
  })

  test('ensure throws if prisma throws', async () => {
    //! Arrange
    const error = new Error('error')
    prismaClient.alunos.update.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(sut.update(aluno)).rejects.toThrowError(error)
  })
})
