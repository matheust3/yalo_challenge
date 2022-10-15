import type { PrismaClient } from '@prisma/client'
import type { IAluno } from '../../domain/models/IAluno'
import type { IAlunoRepository } from '../../domain/repositories/IAlunoRepository'

export class AlunoRepository implements IAlunoRepository {
  constructor (
    private readonly _prismaClient: PrismaClient
  ) {}

  async create (aluno: IAluno): Promise<IAluno> {
    const result = await this._prismaClient.alunos.create({
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

    return {
      id: result.id,
      cpf: result.cpf,
      name: result.name ?? undefined,
      email: result.email ?? undefined,
      id_colegio: result.id_colegio,
      id_turma: result.id_turma,
      score: result.score?.toNumber() ?? undefined
    }
  }

  delete: (id: number) => Promise<void>
  find: (params: { cpf?: string | undefined, id?: number | undefined, idColegio?: number | undefined, idTurma?: number | undefined, score?: number | undefined }) => Promise<IAluno[]>
  getAluno: (params: { cpf?: string | undefined, id?: number | undefined }) => Promise<IAluno | undefined>
  update: (aluno: IAluno) => Promise<IAluno>
}
