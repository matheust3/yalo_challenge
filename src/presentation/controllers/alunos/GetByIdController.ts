import type { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class GetByIdController implements IController {
  async get (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const idStr = httpRequest.params?.id
    if (idStr === undefined) {
      return {
        statusCode: 400,
        body: { message: '"id" is required' }
      }
    }

    const id = Number(idStr)
    if (id !== parseInt(idStr, 10)) {
      return {
        statusCode: 400,
        body: { message: '"id" must be an integer' }
      }
    } else { throw new Error('Method not implemented.') }
  }
}
