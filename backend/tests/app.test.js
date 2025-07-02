const request = require('supertest');
const app = require('../app'); 

test('GET / returns 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

// ADD 2 MORE TESTS (EXAMPLE)
test('POST /login returns 401 for invalid creds', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: "wrong@test.com", password: "badpass" });
  expect(response.statusCode).toBe(401);
});

test('GET /profile returns 403 when unauthenticated', async () => {
  const response = await request(app).get('/profile');
  expect(response.statusCode).toBe(403);
});