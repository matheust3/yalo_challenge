import { AlunoRepository } from './AlunoRepository'
import { DeepMockProxy, mockDeep, MockProxy } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import { IAluno } from '../../domain/models/IAluno'

interface SutTypes {
  sut: AlunoRepository
  prismaClient: DeepMockProxy<PrismaClient> & PrismaClient
  aluno: MockProxy<IAluno> & IAluno
}

const makeSut = (): SutTypes => {
  const prismaClient = mockDeep<PrismaClient>()

  const sut = new AlunoRepository(prismaClient)

  const aluno = mockDeep<IAluno>({
    id: 1,
    cpf: '12345678901',
    email: 'email',
    id_colegio: 1,
    id_turma: 1,
    name: 'name',
    score: 1
  })

  return { sut, prismaClient, aluno }
}

describe('AlunoRepository.spec.ts - create', () => {
  let sut: SutTypes['sut']
  let prismaClient: SutTypes['prismaClient']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, prismaClient, aluno } = makeSut())
  })

  test('ensure call prisma with correct params', async () => {
    //! Arrange
    //! Act
    await sut.create(aluno)
    //! Assert
    expect(prismaClient.alunos.create).toBeCalledWith({
      data: {
        id: aluno.id,
        cpf: aluno.cpf,
        name: aluno.name,
        email: aluno.email,
        id_colegio: aluno.id_colegio,
        id_turma: aluno.id_turma,
        score: aluno.score
      }
    })
  })
})
