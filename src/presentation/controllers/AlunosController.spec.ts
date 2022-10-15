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
  alunosRepository: MockProxy<IAlunoRepository> & IAlunoRepository
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

  const alunosRepository = mock<IAlunoRepository>()

  const sut = new AlunosController(alunosRepository)

  return { sut, aluno, httpRequest, alunosRepository }
}

describe('AlunosController.spec.ts - post', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunosRepository: SutTypes['alunosRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunosRepository, aluno } = makeSut())
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema

    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error: undefined, value: aluno })

    alunosRepository.create.mockResolvedValue(aluno)
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
    expect(alunosRepository.create).toHaveBeenCalledWith(httpRequest.body)
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
    alunosRepository.create.mockRejectedValueOnce(error)
    //! Act
    //! Assert
    await expect(sut.post(httpRequest)).rejects.toThrow(error)
  })
})

describe('AlunosController.spec.ts - put', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunosRepository: SutTypes['alunosRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunosRepository, aluno } = makeSut())
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema

    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error: undefined, value: aluno })

    alunosRepository.create.mockResolvedValue(aluno)
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
})
