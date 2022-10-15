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

  async delete (id: number): Promise<void> {
    await this._prismaClient.alunos.delete({
      where: { id }
    })
  }

  async find (params: { cpf?: string, id?: number, idColegio?: number, idTurma?: number, score?: number }): Promise<IAluno[]> {
    const alunos = await this._prismaClient.alunos.findMany({
      where: {
        cpf: params.cpf,
        id: params.id,
        id_colegio: params.idColegio,
        id_turma: params.idTurma,
        score: params.score
      }
    })
    return alunos.map(aluno => ({
      id: aluno.id,
      cpf: aluno.cpf,
      name: aluno.name ?? undefined,
      email: aluno.email ?? undefined,
      id_colegio: aluno.id_colegio,
      id_turma: aluno.id_turma,
      score: aluno.score?.toNumber() ?? undefined
    }))
  }

  getAluno: (params: { cpf?: string | undefined, id?: number | undefined }) => Promise<IAluno | undefined>
  update: (aluno: IAluno) => Promise<IAluno>
}
