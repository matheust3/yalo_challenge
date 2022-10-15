import Joi from 'joi'

export const FindParamsSchema = Joi.object<{
  id_turma?: number
  id_colegio?: number
  score?: number
}>({
  id_turma: Joi.number().integer().optional(),
  id_colegio: Joi.number().integer().optional(),
  score: Joi.number().optional()
})
