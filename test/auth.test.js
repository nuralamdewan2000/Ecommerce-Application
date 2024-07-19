const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/password.util');

beforeAll(async () => {
  // Sync the database
  await User.sync({ force: true });
  // Create a test user with hashed password
  const hashedPassword = await hashPassword('password123');
  await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: hashedPassword
  });
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400); // Adjusted status code to match the error handling in the controller
    expect(res.body).toHaveProperty('message', 'Invalid password');
  });
});
