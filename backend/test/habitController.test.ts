import request from 'supertest';
import app from '../src/app';
import Habit from '../src/models/Habit';
import User from '../src/models/User';
import mongoose from 'mongoose';

let testUser: any;
let authToken: string;

beforeAll(async () => {
  // Create test user
  testUser = new User({
    email: 'test@habitarium.com',
    password: 'password123'
  });
  await testUser.save();

  // Login to get token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@habitarium.com', password: 'password123' });
  
  authToken = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Habit.deleteMany({});
  await mongoose.connection.close();
});

describe('Habit Controller', () => {
  it('should create a new habit', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Morning Meditation',
        type: 'good'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Morning Meditation');
  });

  it('should log a habit completion', async () => {
    const habit = new Habit({
      userId: testUser._id,
      name: 'Test Habit',
      type: 'good'
    });
    await habit.save();

    const res = await request(app)
      .post(`/api/habits/${habit._id}/log`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'done' });
    
    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(1);
    expect(res.body.logs).toHaveLength(1);
  });
});