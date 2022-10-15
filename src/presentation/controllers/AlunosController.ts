import type { IController, IHttpRequest, IHttpResponse } from '../protocols'
import { AlunoSchema } from '../schemas/AlunoSchema'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'
import { FindParamsSchema } from '../schemas/FindParamsSchema'

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
        const aluno = await this._alunoRepository.getAluno({ cpf: httpRequest.params?.cpf, id })
        if (aluno === undefined) {
          return {
            statusCode: 404,
            body: { message: 'Aluno not found' }
          }
        } else {
          await this._alunoRepository.delete(id)
          return { statusCode: 204, body: undefined }
        }
      }
    }
  }

  async get (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { error, value } = FindParamsSchema.validate(httpRequest.params)
    if (error !== undefined) {
      return {
        statusCode: 400,
        body: { message: error.message }
      }
    } else {
      const alunos = await this._alunoRepository.find({ idColegio: value.id_colegio, idTurma: value.id_turma, score: value.score })
      return {
        statusCode: 200,
        body: alunos
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
