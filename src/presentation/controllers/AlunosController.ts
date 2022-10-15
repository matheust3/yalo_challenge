import type { IController, IHttpRequest, IHttpResponse } from '../protocols'
import { AlunoSchema } from '../schemas/AlunoSchema'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'

export class AlunosController implements IController {
  constructor (
    private readonly _alunoRepository: IAlunoRepository
  ) {}

  async del (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (httpRequest.params?.id === undefined && httpRequest.params?.cpf === undefined) {
      return {
        statusCode: 400,
        body: { message: '"id" or "cpf" is required' }
      }
    } else {
      const id = Number(httpRequest.params?.id)
      if (id !== parseInt(id.toString(), 10)) {
        return {
          statusCode: 400,
          body: { message: '"id" must be a integer' }
        }
      } else {
        await this._alunoRepository.getAluno({ cpf: httpRequest.params?.cpf, id })
        return { statusCode: 200, body: { message: 'Aluno deleted' } }
      }
    }
  }

  async post (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { error, value } = AlunoSchema.validate(httpRequest.body)
    if (error !== undefined) {
      return {
        statusCode: 400,
        body: {
          message: error.message
        }
      }
    } else {
      const aluno = await this._alunoRepository.create(value)
      return {
        statusCode: 201,
        body: aluno
      }
    }
  }

  async put (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { error, value } = AlunoSchema.validate(httpRequest.body)
    if (error !== undefined) {
      return {
        statusCode: 400,
        body: {
          message: error.message
        }
      }
    } else {
      const aluno = await this._alunoRepository.update(value)
      return { statusCode: 200, body: aluno }
    }
  }
}
