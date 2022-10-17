export interface IHttpRequest {
  body?: unknown
  params?: Params
}

interface Params { [key: string]: undefined | string | string[] | Params | Params[] }
