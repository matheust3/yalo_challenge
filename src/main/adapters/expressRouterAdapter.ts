import type { IController, IHttpRequest } from '../../presentation/protocols'
import type * as express from 'express'

export const expressRouterAdapter = (path: string, router: express.Router, controller: IController): void => {
  // Para cada método do controller, cria uma rota no express
  Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).forEach((key: (keyof IController) | 'constructor') => {
    // Para garantir que o método existe no controller
    const method = controller[key]
    if (typeof method === 'function' && key !== 'constructor') {
      // Express não tem o método 'del', então mapeia para 'delete'
      const verb = key === 'del' ? 'delete' : key
      // Cria a rota no express
      router[verb](path, (req: express.Request, res: express.Response) => {
        // Converte o request do express para o request do controller
        const httpRequest: IHttpRequest = {
          body: req.body,
          params: req.query
        }
        // Executa o método do controller
        controller[key]?.(httpRequest).then(httpResponse => {
          if (httpResponse !== undefined) {
            res.status(httpResponse.statusCode).json(httpResponse.body)
          }
        }).catch(error => {
          if (process.env.NODE_ENV === 'development') {
            res.status(500).json({ error: error.message })
          } else {
            res.status(500).json({ error: 'Internal server error' })
          }
          console.error(error)
        })
      })
    }
  })
}
