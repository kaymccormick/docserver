const request = require('supertest');
const app = require('../app');

test('GET /', (done) => {
    request(app).get('/').expect(404, done);
});
