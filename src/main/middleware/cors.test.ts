import app from '../config/app'
import request from 'supertest'

describe('cors.test.ts - Cors', () => {
  test('ensure enable cors', async () => {
    //! Arrange
    app.get('/test_cors', (req, res) => { res.send() })
    //! Act
    //! Assert
    await request(app).get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
