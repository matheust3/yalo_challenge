import { IHttpRequest } from '../../protocols'
import { GetByIdController } from './GetByIdController'

interface SutTypes {
  sut: GetByIdController
  httpRequest: IHttpRequest
}

const makeSut = (): SutTypes => {
  const sut = new GetByIdController()

  const httpRequest: IHttpRequest = {}

  return { sut, httpRequest }
}

describe('GetByIdController.spec.ts - get', () => {
  let sut: SutTypes['sut']
  let httpRequest: SutTypes['httpRequest']

  beforeEach(() => {
    ({ sut, httpRequest } = makeSut())

    httpRequest.params = { id: '2' }
  })

  test('ensure return 400 if id is not passed', async () => {
    //! Arrange
    httpRequest.params = {}
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" is required' })
  })

  test('ensure return error if id in not an integer', async () => {
    //! Arrange
    httpRequest.params = { id: '1.2' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be an integer' })
  })

  test('ensure return error if id is not a number', async () => {
    //! Arrange
    httpRequest.params = { id: 'abc' }
    //! Act
    const httpResponse = await sut.get(httpRequest)
    //! Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ message: '"id" must be an integer' })
  })
})
