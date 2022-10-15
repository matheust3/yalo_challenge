import { AlunosController } from './AlunosController'
import type { IAluno } from '../../domain/models/IAluno'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import * as AlunoSchema from '../schemas/AlunoSchema'
import type { ValidationError } from 'joi'
import type { IHttpRequest } from '../protocols'

interface SutTypes {
  sut: AlunosController
  httpRequest: IHttpRequest
  aluno: IAluno
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

  const sut = new AlunosController()

  return { sut, aluno, httpRequest }
}

describe('AlunosController.spec.ts - post', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']

  beforeEach(() => {
    ({ sut, httpRequest } = makeSut())
  })

  test('ensure return 400 if request body is invalid', async () => {
    //! Arrange
    const alunoSchemaMocked = AlunoSchema as DeepMockProxy<typeof AlunoSchema> & typeof AlunoSchema
    const error = mockDeep<ValidationError>()
    error.message = 'error message'
    alunoSchemaMocked.AlunoSchema.validate.mockReturnValueOnce({ error, value: undefined })
    //! Act
    const httpResponse = await sut.post(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: 'error message' })
  })
})
