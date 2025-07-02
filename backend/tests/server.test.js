const request = require('supertest');
const app = require('../server'); // Make sure you have a server.js file

describe('Habit Tracker API', () => {
  test('GET /api/health should return OK status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      message: 'Habit Tracker API is running'
    });
  });

  test('POST /api/habits should create a new habit', async () => {
    const response = await request(app)
      .post('/api/habits')
      .send({
        name: 'Exercise',
        frequency: 'daily'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Exercise');
  });

  test('GET /api/habits should return all habits', async () => {
    const response = await request(app).get('/api/habits');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Protected routes should require authentication', async () => {
    const response = await request(app).get('/api/user/profile');
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Authentication required');
  });
});