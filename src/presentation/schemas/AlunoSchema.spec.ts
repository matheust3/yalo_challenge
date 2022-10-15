import type { IAuno } from '../../domain/models/IAluno'
import { AlunoSchema } from './AlunoSchema'

interface SutTypes {
  sut: typeof AlunoSchema
  aluno: IAuno
}

const makeSut = (): SutTypes => {
  const sut = AlunoSchema

  const aluno: IAuno = {
    id: 1,
    cpf: '12345678901',
    name: 'John Doe',
    email: 'email.email@d.com',
    id_colegio: 1,
    id_turma: 1,
    score: 1
  }

  return { sut, aluno }
}

describe('AlunoSchema.spec.ts - Validator', () => {
  let sut: SutTypes['sut']
  let aluno: SutTypes['aluno']

  beforeEach(() => {
    ({ sut, aluno } = makeSut())
  })

  test('ensure return error if id is signed integer', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id: -1 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id" must be a positive number')
  })

  test('throat that there is no overflow in the id', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id: 2147483648 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id" must be less than or equal to 2147483647')
  })

  test('ensure error is undefined if id is integer', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate(aluno)
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(aluno)
  })

  test('ensure convert integer string to a number', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, id: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(aluno)
  })

  test('ensure return error if id is a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id: '1s' })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id" must be a number')
  })

  test('ensure return error if id is a float', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id: 1.1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id" must be an integer')
  })

  test('ensure return error if cpf is not a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, cpf: 1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"cpf" must be a string')
  })

  test('ensure return error if cpf is not a number', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, cpf: '1s6d6d6d6d6' })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('CPF must be only numbers without dots or dashes.  Example: 12345678901')
  })

  test('ensure return error if cpf is not a 11 digits', async () => {
    //! Arrange
    //! Act
    const res1 = sut.validate({ ...aluno, cpf: '1' })
    const res2 = sut.validate({ ...aluno, cpf: '1'.repeat(12) })
    //! Assert
    expect(res1.error).not.toBeUndefined()
    expect(res1.error?.message).toEqual('"cpf" length must be 11 characters long')
    expect(res2.error).not.toBeUndefined()
    expect(res2.error?.message).toEqual('"cpf" length must be 11 characters long')
  })

  test('ensure return error if name is not a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, name: 1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"name" must be a string')
  })

  test('ensure the name can be omitted', async () => {
    //! Arrange
    const notNamedAluno = { ...aluno }
    delete notNamedAluno.name
    //! Act
    const { error, value } = sut.validate(notNamedAluno)
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(notNamedAluno)
  })

  test('ensure return error if name is more longer than 254', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, name: '1'.repeat(255) })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"name" length must be less than or equal to 254 characters long')
  })

  test('ensure return error if email is not a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, email: 1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"email" must be a string')
  })

  test('ensure the email can be omitted', async () => {
    //! Arrange
    const notEmailAluno = { ...aluno }
    delete notEmailAluno.email
    //! Act
    const { error, value } = sut.validate(notEmailAluno)
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(notEmailAluno)
  })

  test('ensure validate email', async () => {
    //! Arrange
    //! Act
    const res1 = sut.validate({ ...aluno, email: 'email' })
    //! Assert
    expect(res1.error).not.toBeUndefined()
    expect(res1.error?.message).toEqual('"email" must be a valid email')
  })

  test('ensure not return error if id_colegio is integer', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, id_colegio: 1 })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(aluno)
  })

  test('ensure return error if id_colegio is not a number', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_colegio: '1s' })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id_colegio" must be a number')
  })

  test('ensure return error if id_colegio is a float', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_colegio: 1.1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id_colegio" must be an integer')
  })

  test('ensure convert id_colegio if is a string', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, id_colegio: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual({ ...aluno, id_colegio: 1 })
  })

  test('ensure return error if id_colegio is signed integer', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_colegio: -1 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_colegio" must be a positive number')
  })

  test('throat that there is no overflow in the id_colegio', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_colegio: 2147483648 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_colegio" must be less than or equal to 2147483647')
  })

  test('ensure not return error if id_turma is integer', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, id_turma: 1 })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(aluno)
  })

  test('ensure return error if id_turma is not a number', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_turma: '1s' })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id_turma" must be a number')
  })

  test('ensure return error if id_turma is a float', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_turma: 1.1 })
    //! Assert
    expect(error).not.toBeUndefined()
    expect(error?.message).toEqual('"id_turma" must be an integer')
  })

  test('ensure convert id_turma if is a string', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, id_turma: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual({ ...aluno, id_turma: 1 })
  })

  test('ensure return error if id_turma is signed integer', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_turma: -1 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_turma" must be a positive number')
  })

  test('throat that there is no overflow in the id_turma', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, id_turma: 2147483648 })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"id_turma" must be less than or equal to 2147483647')
  })

  test('ensure not return error if score is a float', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, score: 1.1 })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual({ ...aluno, score: 1.1 })
  })

  test('ensure not return error if score is a integer', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, score: 1 })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual({ ...aluno, score: 1 })
  })

  test('ensure not return error if score is a string of number', async () => {
    //! Arrange
    //! Act
    const { error, value } = sut.validate({ ...aluno, score: '1' })
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual({ ...aluno, score: 1 })
  })

  test('ensure return error if score is a string', async () => {
    //! Arrange
    //! Act
    const { error } = sut.validate({ ...aluno, score: 'a' })
    //! Assert
    expect(error).toBeTruthy()
    expect(error?.message).toBe('"score" must be a number')
  })

  test('ensure the score can be omitted', async () => {
    //! Arrange
    const alunoWithoutScore = { ...aluno }
    delete alunoWithoutScore.score
    //! Act
    const { error, value } = sut.validate(alunoWithoutScore)
    //! Assert
    expect(error).toBeUndefined()
    expect(value).toEqual(alunoWithoutScore)
  })
})
