import { AlunosController } from './AlunosController'
import type { IAluno } from '../../domain/models/IAluno'
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended'
import * as AlunoSchema from '../schemas/AlunoSchema'
import type { ValidationError } from 'joi'
import type { IHttpRequest } from '../protocols'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'

interface SutTypes {
  sut: AlunosController
  httpRequest: IHttpRequest
  aluno: IAluno
  alunoRepository: MockProxy<IAlunoRepository> & IAlunoRepository
}

jest.mock('../schemas/AlunoSchema')

const makeSut = (): SutTypes => {
  const aluno: IAluno = {
    id: 1,
    cpf: '12345678901',
    id_colegio: 1,
    id_turma: 1,
    email: 'email@d.com',
    name: 'name',
    score: 0
  }

  const httpRequest: IHttpRequest = {
    body: aluno
  }

  const alunoRepository = mock<IAlunoRepository>()

  const sut = new AlunosController(alunoRepository)

  return { sut, aluno, httpRequest, alunoRepository }
}

describe('AlunosController.spec.ts - del', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunoRepository: SutTypes['alunoRepository']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository } = makeSut())

    httpRequest.params = { id: '1e3', cpf: '12345678901' }
  })

  test('ensure return 400 if id is not a integer', async () => {
    //! Arrange
    httpRequest.params = { id: '1.1', cpf: '12345678901' }
    //! Act
    const httpResponse = await sut.del(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be a integer' })
  })

  test('ensure return 400 if id is string', async () => {
    //! Arrange
    httpRequest.params = { id: 'string', cpf: '12345678901' }
    //! Act
    const httpResponse = await sut.del(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be a integer' })
  })

  test('ensure return 400 if id and cpf is undefined', async () => {
    //! Arrange
    httpRequest.params = { }
    //! Act
    const httpResponse = await sut.del(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" or "cpf" is required' })
  })

  test('ensure check if aluno exists', async () => {
    //! Arrange
    //! Act
    await sut.del(httpRequest)
    //! Assert
    expect(alunoRepository.getAluno).toHaveBeenCalledWith({ id: 1000, cpf: '12345678901' })
  })
})

describe('AlunosController.spec.ts - post', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunoRepository: SutTypes['alunoRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository, aluno } = makeSut())
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema

    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error: undefined, value: aluno })

    alunoRepository.create.mockResolvedValue(aluno)
  })

  test('ensure return 400 if request body is invalid', async () => {
    //! Arrange
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema
    const error = mockDeep<ValidationError>()
    error.message = 'error message'
    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error, value: undefined })
    //! Act
    const httpResponse = await sut.post(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: 'error message' })
  })

  test('ensure call validator with correct param', async () => {
    //! Arrange
    //! Act
    await sut.post(httpRequest)
    //! Assert
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema
    expect(alunoSchemaMocked.AlunoSchema.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  test('ensure call repository with correct params', async () => {
    //! Arrange
    //! Act
    await sut.post(httpRequest)
    //! Assert
    expect(alunoRepository.create).toHaveBeenCalledWith(httpRequest.body)
  })

  test('ensure return created aluno', async () => {
    //! Arrange
    //! Act
    const httpResponse = await sut.post(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(aluno)
  })

  test('ensure throws if repository throws', async () => {
    //! Arrange
    const error = new Error('error message')
    alunoRepository.create.mockRejectedValueOnce(error)
    //! Act
    //! Assert
    await expect(sut.post(httpRequest)).rejects.toThrow(error)
  })
})

describe('AlunosController.spec.ts - put', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunosRepository: SutTypes['alunoRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository: alunosRepository, aluno } = makeSut())
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema

    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error: undefined, value: aluno })

    alunosRepository.update.mockResolvedValue(aluno)
  })

  test('ensure return 400 if request body is invalid', async () => {
    //! Arrange
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema
    const error = mockDeep<ValidationError>()
    error.message = 'error message'
    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error, value: undefined })
    //! Act
    const httpResponse = await sut.put(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: 'error message' })
  })

  test('ensure call validator with correct param', async () => {
    //! Arrange
    //! Act
    await sut.put(httpRequest)
    //! Assert
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema
    expect(alunoSchemaMocked.AlunoSchema.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  test('ensure call repository with correct params', async () => {
    //! Arrange
    //! Act
    await sut.put(httpRequest)
    //! Assert
    expect(alunosRepository.update).toHaveBeenCalledWith(httpRequest.body)
  })

  test('ensure return updated aluno', async () => {
    //! Arrange
    //! Act
    const httpResponse = await sut.put(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(aluno)
  })

  test('ensure throws if repository throws', async () => {
    //! Arrange
    const error = new Error('error message')
    alunosRepository.update.mockRejectedValueOnce(error)
    //! Act
    //! Assert
    await expect(sut.put(httpRequest)).rejects.toThrow(error)
  })
})
