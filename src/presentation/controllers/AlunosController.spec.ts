import { AlunosController } from './AlunosController'
import type { IAluno } from '../../domain/models/IAluno'

interface SutTypes {
  sut: AlunosController
  aluno: IAluno
}

const makeSut = (): SutTypes => {
  const aluno: IAluno = {
    id: 1,
    cpf: '12345678901',
    id_colegio: 1,
    id_turma: 1,
    email: 'email@d.com',
    name: 'name',
    score: 0
  }
  const sut = new AlunosController()

  return { sut, aluno }
}

describe('AlunosController.spec.ts - post', () => {
  let sut: SutTypes['sut']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, aluno } = makeSut())
  })
})
