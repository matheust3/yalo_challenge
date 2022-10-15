import type { IAluno } from '../models/IAluno'

export interface IAlunoRepository {
  /**
   * Create a new Aluno
   * @param {IAluno} aluno
   * @returns {Promise<IAluno>} Aluno created
   */
  create: (aluno: IAluno) => Promise<IAluno>

  /**
   * Delete a Aluno
   * @param {number} id Aluno id
   * @returns {Promise<void>}
   */
  delete: (id: number) => Promise<void>

  /**
   * Get the list of registered alunos
   * @param {number} idTurma Turma id
   * @param {number} idColegio Colegio id
   * @param {number} score Score
   * @returns {Promise<IAluno[]>} List of alunos
   */
  find: (params: { idColegio?: number, idTurma?: number, score?: number }) => Promise<IAluno[]>

  /**
   * Get a Aluno by id or cpf
   * @param {number} id Aluno id
   * @param {string} cpf Aluno cpf
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
