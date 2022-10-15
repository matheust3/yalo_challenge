import type { IAuno } from '../../domain/models/IAluno'
import Joi from 'joi'

export const AlunoSchema = Joi.object<IAuno>({
  id: Joi.number().integer().positive().max(2147483647).required(),
  cpf: Joi.string().required().min(11).message('"cpf" length must be 11 characters long').max(11).message('"cpf" length must be 11 characters long').regex(/^[0-9]+$/).message('CPF must be only numbers without dots or dashes.  Example: 12345678901'),
  name: Joi.string().max(254),
  email: Joi.string().email(),
  id_colegio: Joi.number().integer().positive().max(2147483647).required(),
  id_turma: Joi.number().integer().positive().max(2147483647).required(),
  score: Joi.number()
})
