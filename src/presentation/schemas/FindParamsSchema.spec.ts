import { FindParamsSchema } from './FindParamsSchema'

interface SutTypes {
  sut: typeof FindParamsSchema
  params: {
    id_turma?: number
    id_colegio?: number
    score?: number
  }
}

const makeSut = (): SutTypes => {
  const sut = FindParamsSchema

  const params: {
    id_turma?: number
    id_colegio?: number
    score?: number
  } = {
    id_colegio: 1,
    id_turma: 2,
    score: 3.4
  }

  return { sut, params }
}

describe('FindParamsSchema.spec.ts - validator', () => {
  let sut: SutTypes['sut']
  let params: SutTypes['params']

  beforeEach(() => {
    ({ sut, params } = makeSut())
  })

  test('ensure return error if id_turma is not integer', async () => {
    //! Arrange
    params.id_turma = 1.1
    //! Act
    const { error } = sut.validate(params)
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toBe('"id_turma" must be an integer')
  })
  test('ensure return error if id_turma is not integer', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...params, id_turma: 'string' })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_turma" must be a number')
  })
  test('ensure convert string number to a number', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...params, id_turma: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value?.id_turma).toBe(1)
  })

  test('ensure return error if id_colegio is not integer', async () => {
    //! Arrange
    params.id_colegio = 1.1
    //! Act
    const { error } = sut.validate(params)
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toBe('"id_colegio" must be an integer')
  })
  test('ensure return error if id_colegio is not integer', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...params, id_colegio: 'string' })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_colegio" must be a number')
  })
  test('ensure convert string number to a number', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...params, id_colegio: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value?.id_colegio).toBe(1)
  })

  test('ensure return error if score is a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...params, score: 'string' })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toBe('"score" must be a number')
  })

  test('ensure convert score string to a number', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...params, score: '1.1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value?.score).toBe(1.1)
  })
})
