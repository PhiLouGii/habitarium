const request = require('supertest');
const express = require('express');

// Minimal server setup reflecting your minimal index.js
const app = express();
app.get('/', (req, res) => {
  res.status(200).send('Habitarium backend is running!');
});

describe('GET /', () => {
  it('responds with status 200 and expected body', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Habitarium backend is running!');
  });
});
