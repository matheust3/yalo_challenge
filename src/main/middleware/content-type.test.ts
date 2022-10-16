import app from '../config/app'
import request from 'supertest'

describe('content-type.test.ts - Content type', () => {
  test('ensure return content type as json by default', async () => {
    //! Arrange
    app.get('/test_content_type', (req, res) => { res.send() })
    //! Act
    //! Assert
    await request(app).get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('ensure return content type as xml when forced', async () => {
    //! Arrange
    app.get('/test_content_type_xml', (req, res) => { res.type('xml'); res.send() })
    //! Act
    //! Assert
    await request(app).get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
