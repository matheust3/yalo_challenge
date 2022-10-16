import * as PrismaClient from '../../../ci/prisma-client'
import { Express } from 'express'
import supertest from 'supertest'
import { IAluno } from '../../domain/models/IAluno'

// Mock the PrismaClient singleton
jest.mock('@prisma/client', () => PrismaClient)

describe('alunos-route.test.ts - post', () => {
  let app: Express
  let prismaClient: PrismaClient.PrismaClient
  let aluno: IAluno

  beforeAll(async () => {
    // Inicializa os servidor com um banco de dados fake
    app = (await import('../config/app')).default
    prismaClient = new PrismaClient.PrismaClient()
  })

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prismaClient.alunos.deleteMany()

    aluno = {
      id: 1,
      name: 'Aluno 1',
      email: 'email@domain.com',
      cpf: '12345678901',
      id_colegio: 1,
      id_turma: 1,
      score: 0
    }
  })

  test('ensure create a aluno and return 201', async () => {
    //! Arrange
    //! Act
    const result = await supertest(app).post('/api/alunos').send(aluno)
    //! Assert
    expect(result.body).toEqual(aluno)
    expect(result.status).toBe(201)
  })

  test('ensure not create two alunos with same cpf', async () => {
    //! Arrange
    const aluno2 = { ...aluno, id: 2 }
    //! Act
    const result1 = await supertest(app).post('/api/alunos').send(aluno)
    const result2 = await supertest(app).post('/api/alunos').send(aluno2)
    //! Assert
    expect(result1.body).toEqual(aluno)
    expect(result1.status).toBe(201)
    expect(result2.body).toEqual({ message: 'cpf is already in use' })
    expect(result2.status).toBe(409)
  })

  test('ensure not create two alunos with same ids', async () => {
    //! Arrange
    const aluno2 = { ...aluno, cpf: '12345678902' }
    //! Act
    const result1 = await supertest(app).post('/api/alunos').send(aluno)
    const result2 = await supertest(app).post('/api/alunos').send(aluno2)
    //! Assert
    expect(result1.body).toEqual(aluno)
    expect(result1.status).toBe(201)
    expect(result2.body).toEqual({ message: 'id is already in use' })
    expect(result2.status).toBe(409)
  })
})
