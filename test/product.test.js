const request = require('supertest');
const app = require('../app');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/password.util');

let token;
let categoryId;

beforeAll(async () => {
  // Sync the database and create test data
  await User.sync({ force: true });
  await Product.sync({ force: true });
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

  // Create a category for the product
  const category = await Category.create({
    name: 'Test Category'
  });

  categoryId = category.id;
});

afterAll(async () => {
  // Cleanup and close the database connection
  await Product.drop(); // Use drop to ensure tables are removed
  await Category.drop();
  await User.drop();
});

describe('Product Endpoints', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        price: 100,
        categoryId: categoryId
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a specific product by ID', async () => {
    const product = await Product.create({
      name: 'Another Product',
      price: 200,
      categoryId: categoryId
    });

    const res = await request(app)
      .get(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Another Product');
  });

  it('should update an existing product', async () => {
    const product = await Product.create({
      name: 'Update Product',
      price: 300,
      categoryId: categoryId
    });

    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Product',
        price: 400
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Product');
  });

  it('should delete a product', async () => {
    const product = await Product.create({
      name: 'Delete Product',
      price: 500,
      categoryId: categoryId
    });

    const res = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Product deleted');
  });
});
