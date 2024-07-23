const request = require('supertest');
const app = require('../app'); // Assuming app.js is your entry point
const { sequelize, User } = require('../models/user.model');
const { hashPassword } = require('../utils/password.util');
const { generateToken } = require('../utils/token.util');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {

  describe('Register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User registration sucessfully');

      const user = await User.findOne({ where: { email: 'test@example.com' } });
      expect(user).not.toBeNull();
      expect(user.username).toBe('testuser');
    });

    it('should not register a user with existing email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
          email: 'test2@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'User registration failed');
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Login', () => {
    it('should login an existing user', async () => {
      const hashedPassword = await hashPassword('password123');
      await User.create({ username: 'loginuser', email: 'login@example.com', password: hashedPassword });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid password');
    });

    it('should not login non-existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexisting@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('Get Profile', () => {
    let token;

    beforeAll(async () => {
      const hashedPassword = await hashPassword('password123');
      const user = await User.create({ username: 'profileuser', email: 'profile@example.com', password: hashedPassword });
      token = `Bearer ${generateToken(user)}`;
    });

    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('username', 'profileuser');
      expect(res.body).toHaveProperty('email', 'profile@example.com');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Authentication token is missing or invalid');
    });
  });

  describe('Update Profile', () => {
    let token;
    let user;

    beforeAll(async () => {
      const hashedPassword = await hashPassword('password123');
      user = await User.create({ username: 'updateuser', email: 'update@example.com', password: hashedPassword });
      token = `Bearer ${generateToken(user)}`;
    });

    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', token)
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
          password: 'newpassword123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('username', 'updateduser');
      expect(res.body).toHaveProperty('email', 'updated@example.com');

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.username).toBe('updateduser');
      expect(updatedUser.email).toBe('updated@example.com');
    });

    it('should return 404 for non-existing user', async () => {
      const newToken = `Bearer ${generateToken({ id: 999 })}`; // Non-existing user ID

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', newToken)
        .send({
          username: 'nonexistinguser',
          email: 'nonexisting@example.com',
          password: 'newpassword123'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('Delete Profile', () => {
    let token;
    let user;

    beforeAll(async () => {
      const hashedPassword = await hashPassword('password123');
      user = await User.create({ username: 'deleteuser', email: 'delete@example.com', password: hashedPassword });
      token = `Bearer ${generateToken(user)}`;
    });

    it('should delete user profile', async () => {
      const res = await request(app)
        .delete('/api/auth/profile')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User deleted');

      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existing user', async () => {
      const newToken = `Bearer ${generateToken({ id: 999 })}`; // Non-existing user ID

      const res = await request(app)
        .delete('/api/auth/profile')
        .set('Authorization', newToken);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });
  });
});
