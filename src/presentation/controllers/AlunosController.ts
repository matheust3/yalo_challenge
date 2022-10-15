import type { IController, IHttpRequest, IHttpResponse } from '../protocols'
import { AlunoSchema } from '../schemas/AlunoSchema'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'

export class AlunosController implements IController {
  constructor (
    private readonly _alunosRepository: IAlunoRepository
  ) {}

  async del (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (httpRequest.params?.id === undefined && httpRequest.params?.cpf === undefined) {
      return {
        statusCode: 400,
        body: { message: '"id" or "cpf" is required' }
      }
    } else {
      throw Error('Method not implemented.')
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
      const aluno = await this._alunosRepository.create(value)
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
      const aluno = await this._alunosRepository.update(value)
      return { statusCode: 200, body: aluno }
    }
  }
}
