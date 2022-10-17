import { Express, Router } from 'express'
import fg from 'fast-glob'

// Função responsável por carregar todos os arquivos de rotas
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router) // Todas as rotas serão prefixadas com /api
  // Carrega todos os arquivos de rotas
  fg.sync('./../**/routes/**/**route.*', { cwd: __dirname }).forEach(file => {
    if (!file.endsWith('.test.ts')) {
      import(file).then((value) => value.default(router)).catch(console.error)
    }
  })
}
