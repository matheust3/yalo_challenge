import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

// Função responsável por carregar todos os arquivos de rotas
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router) // Todas as rotas serão prefixadas com /api
  fs.readdirSync(path.join(__dirname, '/../routes')).map(async file => {
    if (!file.endsWith('.test.ts')) {
      import(`../routes/${file}`).then((value) => value.default(router)).catch(console.error)
    }
  })
}
