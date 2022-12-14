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
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository, aluno } = makeSut())

    httpRequest.params = { id: '1e3', cpf: '12345678901' }

    alunoRepository.getAluno.mockResolvedValue(aluno)
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

  test('ensure check if aluno exists if id is undefined', async () => {
    //! Arrange
    httpRequest.params = { cpf: '12345678901' }
    //! Act
    await sut.del(httpRequest)
    //! Assert
    expect(alunoRepository.getAluno).toHaveBeenCalledWith({ cpf: '12345678901' })
  })

  test('ensure check if aluno exists', async () => {
    //! Arrange
    //! Act
    await sut.del(httpRequest)
    //! Assert
    expect(alunoRepository.getAluno).toHaveBeenCalledWith({ id: 1000, cpf: '12345678901' })
  })

  test('ensure return 404 if aluno not found', async () => {
    //! Arrange
    alunoRepository.getAluno.mockResolvedValue(undefined)
    //! Act
    const httpResponse = await sut.del(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({ message: 'Aluno not found' })
  })

  test('ensure return 204 if delete aluno', async () => {
    //! Arrange
    alunoRepository.getAluno.mockResolvedValue({ ...aluno, id: 4546 })
    //! Act
    const httpResponse = await sut.del(httpRequest)
    //! Assert
    expect(alunoRepository.delete).toHaveBeenCalledWith(4546)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeUndefined()
  })

  test('ensure throws if repository throws', async () => {
    //! Arrange
    alunoRepository.getAluno.mockRejectedValue(new Error('error'))
    //! Act
    //! Assert
    await expect(sut.del(httpRequest)).rejects.toThrow(new Error('error'))
  })
})

describe('AlunosController.spec.ts - get', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunoRepository: SutTypes['alunoRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository, aluno } = makeSut())

    httpRequest.params = { id_turma: '1e3', id_colegio: '4', score: '4.0' }

    alunoRepository.find.mockResolvedValue([aluno])
  })

  test('ensure return 400 if id_turma is not a integer', async () => {
    //! Arrange
    httpRequest.params = { id_turma: '1.1' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id_turma" must be an integer' })
  })

  test('ensure return 400 if id_turma is a string', async () => {
    //! Arrange
    httpRequest.params = { id_turma: 'string' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id_turma" must be a number' })
  })
  test('ensure return 400 if id_colegio is not a integer', async () => {
    //! Arrange
    httpRequest.params = { id_colegio: '1.1' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id_colegio" must be an integer' })
  })

  test('ensure return 400 if id_colegio is a string', async () => {
    //! Arrange
    httpRequest.params = { id_colegio: 'string' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id_colegio" must be a number' })
  })
  test('ensure return 400 if score is not a number', async () => {
    //! Arrange
    httpRequest.params = { score: 'string' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"score" must be a number' })
  })

  test('ensure call repository with correct params', async () => {
    //! Arrange
    //! Act
    await sut.get(httpRequest)
    //! Assert
    expect(alunoRepository.find).toHaveBeenCalledWith({ idTurma: 1000, idColegio: 4, score: 4.0 })
  })

  test('ensure return alunos array', async () => {
    //! Arrange
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([aluno])
  })

  test('ensure return error if params is invalid', async () => {
    //! Arrange
    httpRequest.params = { id_turma: '1', id_colegio: '1', score: '10', id: '1' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" is not allowed' })
  })

  test('ensure not return error if no params as passed', async () => {
    //! Arrange
    httpRequest.params = {}
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([aluno])
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
    alunoRepository.find.mockResolvedValue([])
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

  test('ensure check if cpf and id is already in use', async () => {
    //! Arrange
    //! Act
    await sut.post(httpRequest)
    //! Assert
    expect(alunoRepository.find.mock.calls).toEqual(
      [
        [{ cpf: aluno.cpf }],
        [{ id: aluno.id }]
      ]
    )
  })

  test('ensure return error if cpf is already in use', async () => {
    //! Arrange
    alunoRepository.find
      .mockResolvedValueOnce([{ ...aluno, id: aluno.id + 1 }])
      .mockResolvedValueOnce([])
    //! Act
    const httpResponse = await sut.post(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({ message: 'cpf is already in use' })
  })

  test('ensure return error if id is already in use', async () => {
    //! Arrange
    alunoRepository.find
      .mockResolvedValueOnce([])
      .mockResolvedValue([{ ...aluno, id: aluno.id, cpf: '01234567892' }])
    //! Act
    const httpResponse = await sut.post(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({ message: 'id is already in use' })
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
  let alunoRepository: SutTypes['alunoRepository']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository, aluno } = makeSut())
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema

    alunoSchemaMocked.AlunoSchema.validate.mockReset().mockReturnValueOnce({ error: undefined, value: aluno })

    alunoRepository.update.mockResolvedValue(aluno)
    alunoRepository.find.mockResolvedValue([aluno])
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
    expect(alunoRepository.update).toHaveBeenCalledWith(httpRequest.body)
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
    alunoRepository.update.mockRejectedValueOnce(error)
    //! Act
    //! Assert
    await expect(sut.put(httpRequest)).rejects.toThrow(error)
  })

  test('ensure check if aluno exists', async () => {
    //! Arrange
    //! Act
    await sut.put(httpRequest)
    //! Assert
    expect(alunoRepository.find).toHaveBeenCalledWith({ id: aluno.id })
  })

  test('ensure return error if aluno not found', async () => {
    //! Arrange
    alunoRepository.find.mockResolvedValue([])
    //! Act
    const httpResponse = await sut.put(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({ message: 'aluno not found' })
  })

  test('ensure check if cpf is already in use by another aluno', async () => {
    //! Arrange
    alunoRepository.find.mockResolvedValue([{ ...aluno, id: 1 }])
    alunoRepository.getAluno.mockResolvedValue({ ...aluno, id: 4546 })
    //! Act
    const httpResponse = await sut.put(httpRequest)
    //! Assert
    expect(alunoRepository.getAluno).toHaveBeenCalledWith({ cpf: '12345678901' })
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({ message: 'cpf is already in use by another aluno' })
  })
})
