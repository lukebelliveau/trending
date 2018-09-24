const request = require('supertest');
const { init } = require('../src/server');

describe('/trending', () => {
  let app;

  beforeEach(() => {
    app = init(8080);
  })

  afterEach(() => {
    app.close();
  })

  it('is healthy', (done) => {
    request(app)
    .get('/trending')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      const topics = response.body.topics;

      expect(topics).toHaveLength(5);
      done();
    })
  });
})