import type { IController, IHttpRequest, IHttpResponse } from '../protocols'
import { AlunoSchema } from '../schemas/AlunoSchema'

export class AlunosController implements IController {
  async post (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { error } = AlunoSchema.validate(httpRequest.body)
    if (error !== undefined) {
      return {
        statusCode: 400,
        body: {
          message: error.message
        }
      }
    }
    throw new Error('Not implemented')
  }
}
