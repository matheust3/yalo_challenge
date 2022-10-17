import type { Router } from 'express'
import { GetByIdController } from '../../../presentation/controllers/alunos/GetByIdController'
import { expressRouterAdapter } from '../../adapters/expressRouterAdapter'
import alunoRepository from '../../singletons/alunoRepository'

export default (router: Router): void => {
  const controller = new GetByIdController(alunoRepository)
  expressRouterAdapter('/alunos/get-by-id', router, controller)
}
