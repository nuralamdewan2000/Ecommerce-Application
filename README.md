# E-Commerrce Application API
Welcome to the  E-Commerrce Application API This API allows you to manage products and user accounts efficiently. Below, you'll find instructions on how to set up and run the API locally, as well as how to test it using Swagger UI.

## Table of Contents
- [Live Deployed Server ](#Live-Deployed-Server)
- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Project Structure](#Project-Structure)
- [Configuration](#Configuration)
- [Running the API](#Running-the-API)
- [API Documentation](#API-Documentation)
- [Testing the API](#Testing-the-API)
- [Additional Notes](#Additional-Notes)

## Live Deployed Server
- The API is deployed and available live on Render at the following URL:

```perl
https://ecommerce-application-zgot.onrender.com//api-docs/#
```
- swagger docs
```perl
https://ecommerce-application-zgot.onrender.com//api-docs/#
http://localhost:3000/api-docs/#
```
- BaseURL
```perl
https://ecommerce-application-zgot.onrender.com/
```
You can use this link to access and interact with the API directly without needing to run it locally.


## Prerequisites
Before you can set up the API locally, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or Yarn (npm is used in these instructions)
- MySQL (locally or using any cloud MySQL  service)

## Installation
1) Clone the repository:
```bash
git clone https://github.com/nuralamdewan2000/Ecommerce-Application.git
cd Ecommerce-Application
```
2) Install dependencies:
```bash
npm install
```
## Project Structure
```bash
Ecommerce-Application/
├── config/
│   └── db.config.js
├── controllers/
│   ├── category.controller.js
│   ├── product.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── models/
│   ├── category.model.js
│   ├── product.model.js
│   └── user.model.js
├── routes/
│   ├── category.routes.js
│   ├── product.routes.js
│   └── user.routes.js
├── test/
│   ├── category.test.js
│   ├── product.test.js
│   └── user.test.js
├── utils/
│   ├── password.util.js
│   └── token.util.js
├── .env
├── app.js
├── package.json
├── README.md

```
## Configuration
Create a `.env` file in the root directory and configure the following environment variables:

```bash
PORT=3000
DATABASE_URL=Your_MySQL_Database_URL
JWT_SECRET=your_jwt_secret
```
- PORT: The port number on which the server will run.
- DATABASE_URL: The URL of your MySQLinstance.
- JWT_SECRET: The secret key for signing JSON Web Tokens (JWT).

## Running the API
1) Start the API server:

```bash
npm start
The API will be running at http://localhost:3000
```

## API Documentation
The API uses Swagger for documentation. Once the server is running, you can access the Swagger UI to explore the API endpoints at:

```bash
https://ecommerce-application-zgot.onrender.com/api-docs/#
```


## Testing the API
You can test the API endpoints using tools like Postman or through the Swagger UI. The Swagger UI provides a web-based interface where you can interact with the API endpoints directly.

### Running Tests Locally
To run the automated tests for the API, use the following command:

```bash
npm test
```
This command will execute the tests defined in your project and report any issues. Make sure to have your development environment properly set up before running tests.

### Example Requests

#### User Endpoints

1) User Signup:

- Endpoint: `POST /api/user/register`
- Body:
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "mypassword"
}
```
2) User Login:

- Endpoint: `POST /api/user/login`
- Body:
```json
{
  "email": "john.doe@example.com",
  "password": "mypassword"
}
```
3) Get User Profile:

- Endpoint: `GET /users/profile`
- Headers: Authorization: Bearer <your_token_here>

4) Update User Profile:

- Endpoint: `PUT /users/profile`
- Headers: Authorization: Bearer <your_token_here>
- Body:
```json
{
   "username":"John_Doe",
  "email": "john.doe.15@example.com",
  "password": "mypassword"
}
```
4) Delete User Profile:

- Endpoint: `DELETE /users/profile`
- Headers: Authorization: Bearer <your_token_here>

#### Product Endpoints

1) Create a Product:

- Endpoint: `POST /api/products`
- Headers: Authorization: Bearer <your_token_here>
- Body:
```json
{
  "name": "Product Name",
  "price": 100,
  "categoryId": 1
}

```
2) Get All Products:

- Endpoint: `GET /api/products`
- Headers: Authorization: Bearer <your_token_here>

3) Get Product by ID: 
- Endpoint: `GET /api/products/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
 - - `id`: The ID of the product you want to retrieve.

4) Update product by ID: 
- Endpoint: `PUT /api/products/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the product you want to update.
- Body:
```json
{
  "name": "Updated Product Name",
  "price": 150
}
```
5) Delete Product by ID:
- Endpoint: `DELETE /api/products/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the product you want to delete.

#### Category Endpoints

1) Create a Category:

- Endpoint: `POST /api/categories`
- Headers: Authorization: Bearer <your_token_here>
- Body:
```json
{
  "name": "Category Name"
}


```
2) Get All Categories:

- Endpoint: `GET /api/categories`
- Headers: Authorization: Bearer <your_token_here>

3) Get Category by ID: 
- Endpoint: `GET /api/categories/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
 - - `id`: The ID of the category you want to retrieve.

4) Update Category by ID: 
- Endpoint: `PUT /api/categories/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the category you want to update.
- Body:
```json
{
  "name": "Updated Category Name"
}

```
5) Delete Category by ID:
- Endpoint: `DELETE /api/categories/{id}`
- Headers: Authorization: Bearer <your_token_here>
- Parameters:
- - `id`: The ID of the category you want to delete.

## Additional Notes
- Error Handling: The API includes basic error handling, but further improvements can be made to standardize and enhance error responses.
- Security: Ensure to keep your JWT_SECRET secure and do not expose them publicly.
- Environment Variables: Do not commit the .env file to version control. Use a .env.example file for reference without sensitive data.

