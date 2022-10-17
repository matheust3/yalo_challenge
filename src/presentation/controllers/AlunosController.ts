import type { IController, IHttpRequest, IHttpResponse } from '../protocols'
import { AlunoSchema } from '../schemas/AlunoSchema'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'
import { FindParamsSchema } from '../schemas/FindParamsSchema'

export class AlunosController implements IController {
  constructor (
    private readonly _alunoRepository: IAlunoRepository
  ) {}

  async del (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (typeof httpRequest.params?.id !== 'string' && typeof httpRequest.params?.cpf !== 'string') {
      return {
        statusCode: 400,
        body: { message: '"id" or "cpf" is required' }
      }
    } else {
      const id = typeof httpRequest.params?.id === 'string' ? Number(httpRequest.params?.id) : undefined
      const cpf = typeof httpRequest.params?.cpf === 'string' ? httpRequest.params?.cpf : undefined
      if (id !== undefined && id !== parseInt(id.toString(), 10)) {
        return {
          statusCode: 400,
          body: { message: '"id" must be a integer' }
        }
      } else {
        const aluno = await this._alunoRepository.getAluno({ cpf, id })
        if (aluno === undefined) {
          return {
            statusCode: 404,
            body: { message: 'Aluno not found' }
          }
        } else {
          await this._alunoRepository.delete(aluno.id)
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
      const alunos = [
        ...await this._alunoRepository.find({ cpf: value.cpf }),
        ...await this._alunoRepository.find({ id: value.id })
      ]
      const sameId = alunos.find(aluno => aluno.id === value.id)
      const sameCpf = alunos.find(aluno => aluno.cpf === value.cpf)
      if (sameId === undefined && sameCpf === undefined) {
        const aluno = await this._alunoRepository.create(value)
        return {
          statusCode: 201,
          body: aluno
        }
      } else {
        return {
          statusCode: 409,
          body: {
            message: `${(sameId !== undefined) ? 'id' : 'cpf'} is already in use`
          }
        }
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
      if ((await this._alunoRepository.find({ id: value.id })).length !== 0) {
        const conflictCpt = await this._alunoRepository.getAluno({ cpf: value.cpf })
        if (conflictCpt !== undefined && conflictCpt.id !== value.id) {
          return {
            statusCode: 409,
            body: {
              message: 'cpf is already in use by another aluno'
            }
          }
        } else {
          const aluno = await this._alunoRepository.update(value)
          return { statusCode: 200, body: aluno }
        }
      } else {
        return {
          statusCode: 404,
          body: {
            message: 'aluno not found'
          }
        }
      }
    }
  }
}
