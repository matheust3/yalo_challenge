import type { Router } from 'express'
import { AlunosController } from '../../presentation/controllers/AlunosController'
import { expressRouterAdapter } from '../adapters/expressRouterAdapter'
import alunoRepository from '../singletons/alunoRepository'

export default (router: Router): void => {
  const controller = new AlunosController(alunoRepository)
  expressRouterAdapter('/alunos', router, controller)
}
