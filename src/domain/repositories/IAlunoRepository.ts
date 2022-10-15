import type { IAluno } from '../models/IAluno'

export interface IAlunoRepository {
  /**
   * Create a new Aluno
   * @param {IAluno} aluno
   * @returns {Promise<IAluno>} Aluno created
   */
  create: (aluno: IAluno) => Promise<IAluno>

  /**
   * Update a Aluno
   * @param {IAluno} aluno
   * @returns {Promise<IAluno>} Aluno updated
   */
  update: (aluno: IAluno) => Promise<IAluno>
}
