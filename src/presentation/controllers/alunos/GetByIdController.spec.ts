import { mock, MockProxy } from 'jest-mock-extended'
import { IAluno } from '../../../domain/models/IAluno'
import { IAlunoRepository } from '../../../domain/repositories/IAlunoRepository'
import { IHttpRequest } from '../../protocols'
import { GetByIdController } from './GetByIdController'

interface SutTypes {
  sut: GetByIdController
  httpRequest: IHttpRequest
  alunoRepository: MockProxy<IAlunoRepository> & IAlunoRepository
  aluno: MockProxy<IAluno> & IAluno
}

const makeSut = (): SutTypes => {
  const alunoRepository = mock<IAlunoRepository>()
  const sut = new GetByIdController(alunoRepository)

  const aluno = mock<IAluno>({ id: 2 })
  const httpRequest: IHttpRequest = {}

  return { sut, httpRequest, alunoRepository, aluno }
}

describe('GetByIdController.spec.ts - get', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']
  let alunoRepository: SutTypes['alunoRepository']

  beforeEach(() => {
    ({ sut, httpRequest, alunoRepository } = makeSut())

    httpRequest.params = { id: '2' }
  })

  test('ensure return 400 if id is not passed', async () => {
    //! Arrange
    httpRequest.params = {}
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" is required' })
  })

  test('ensure return error if id in not an integer', async () => {
    //! Arrange
    httpRequest.params = { id: '1.2' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be an integer' })
  })

  test('ensure return error if id is not a number', async () => {
    //! Arrange
    httpRequest.params = { id: 'abc' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be an integer' })
  })

  test('ensure call repository with correct params', async () => {
    //! Arrange
    //! Act
    await sut.get(httpRequest)
    //! Assert
    expect(alunoRepository.getAluno).toBeCalledWith({ id: 2 })
  })

  test('ensure return 404 if aluno not exists', async () => {
    //! Arrange
    alunoRepository.getAluno.mockResolvedValue(undefined)
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({ message: 'Aluno not found' })
  })
})
