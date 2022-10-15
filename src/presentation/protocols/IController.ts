import type { IHttpRequest } from './IHttpRequest'
import type { IHttpResponse } from './IHttpResponse'

export interface IController {
  del?: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
  get?: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
  post?: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
  put?: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
}
