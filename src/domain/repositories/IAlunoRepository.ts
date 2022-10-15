import type { IAluno } from '../models/IAluno'

export interface IAlunoRepository {
  /**
   * Create a new Aluno
   * @param {IAluno} aluno
   * @returns {Promise<IAluno>} Aluno created
   */
  create: (aluno: IAluno) => Promise<IAluno>

  /**
   * Get a Aluno by id or cpf
   * @param {number} id - Aluno id
   * @param {string} cpf - Aluno cpf
   * @returns {Promise<IAluno | undefined>} Aluno found
   */
  getAluno: (params: { cpf?: string, id?: number }) => Promise<IAluno | undefined>

  /**
   * Update a Aluno
   * @param {IAluno} aluno
   * @returns {Promise<IAluno>} Aluno updated
   */
  update: (aluno: IAluno) => Promise<IAluno>
}
