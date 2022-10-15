import type { IAlunoRepository } from '../../../domain/repositories/IAlunoRepository'
import type { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class GetByIdController implements IController {
  constructor (
    private readonly _alunoRepository: IAlunoRepository
  ) {}

  async get (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // Verifica se o id foi passado
    const idStr = httpRequest.params?.id
    if (idStr === undefined) {
      return {
        statusCode: 400,
        body: { message: '"id" is required' }
      }
    }
    // Verifica se o id é um número inteiro
    const id = Number(idStr)
    if (id !== parseInt(idStr, 10)) {
      return {
        statusCode: 400,
        body: { message: '"id" must be an integer' }
      }
    } else {
      const aluno = await this._alunoRepository.getAluno({ id })
      if (aluno === undefined) {
        return {
          statusCode: 404,
          body: { message: 'Aluno not found' }
        }
      } else {
        return {
          statusCode: 200,
          body: {}
        }
      }
    }
  }
}
