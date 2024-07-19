# Ecommerce-Application
# Node.js MySQL API

A simple Node.js API using MySQL.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file based on the example provided.
4. Run the application: `npm start`
5. Run tests: `npm test`

## Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Products

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a product by ID
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

### Categories

- `GET /api/categories`: Get all categories
- `GET /api/categories/:id`: Get a category by ID
- `POST /api/categories`: Create a new category
- `PUT /api/categories/:id`: Update a category
- `DELETE /api/categories/:id`: Delete a category

## Documentation

API documentation is provided in the `swagger.json` file. Use a tool like Swagger UI to visualize it.
