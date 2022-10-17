import { AlunoRepository } from '../../data/repositories/AlunoRepository'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'
import prismaClient from './prismaClient'

class Singleton {
  private static instance?: Singleton
  readonly obj: IAlunoRepository

  private constructor () {
    this.obj = new AlunoRepository(prismaClient)
  }

  static getInstance (): Singleton {
    if (Singleton.instance === undefined) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}

export default Singleton.getInstance().obj
