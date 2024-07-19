const request = require('supertest');
const app = require('../app');
const Category = require('../models/category.model');
const User = require('../models/user.model'); // Correct import for User model
const { hashPassword } = require('../utils/password.util');

let token;

beforeAll(async () => {
  // Sync the database and create test data
  await User.sync({ force: true });
  await Category.sync({ force: true });

  // Create a test user with hashed password
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
  // Cleanup and close the database connection
  await User.drop();  // Use drop to ensure tables are removed
  await Category.drop();
});

describe('Category Endpoints', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Category'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Category');
  });

  it('should get all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a specific category by ID', async () => {
    const category = await Category.create({
      name: 'Specific Category'
    });

    const res = await request(app)
      .get(`/api/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Specific Category');
  });

  it('should update an existing category', async () => {
    const category = await Category.create({
      name: 'Update Category'
    });

    const res = await request(app)
      .put(`/api/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Category'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Category');
  });

  it('should delete a category', async () => {
    const category = await Category.create({
      name: 'Delete Category'
    });

    const res = await request(app)
      .delete(`/api/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Category deleted');
  });
});
