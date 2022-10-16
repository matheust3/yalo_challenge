import request from 'supertest'
import app from '../config/app'

describe('body-parser.test.ts - Body parser', () => {
  test('ensure parse body to json', async () => {
    //! Arrange
    app.post('/test_body_parser', (req, res) => { res.send(req.body) })
    //! Act
    //! Assert
    await request(app).post('/test_body_parser').send({ name: 'any_name' }).expect({ name: 'any_name' })
  })
})
