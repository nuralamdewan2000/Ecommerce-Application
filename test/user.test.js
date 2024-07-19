const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/password.util');

let token;

beforeAll(async () => {
  await User.sync({ force: true });

  const hashedPassword = await hashPassword('password123');
  const user = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: hashedPassword
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await User.drop();
});

describe('User Endpoints', () => {
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

  it('should not register a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'duplicateuser',
        email: 'testuser@example.com', // Email already exists
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email already in use');
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
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should get the user profile', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });

  it('should update the user profile', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updateduser'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'updateduser');
  });

  it('should not update the user profile without authentication', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .send({
        username: 'unauthenticateduser'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Authentication token is missing or invalid');
  });

  it('should delete the user account', async () => {
    const res = await request(app)
      .delete('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted');
  });

  it('should not get the user profile after deletion', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
