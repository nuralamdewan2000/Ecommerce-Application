const express = require('express');
const swaggerJSdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const { sequelize, connectToDB } = require('./config/db.config');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the Basic Ecommerce Platform" });
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce Application API',
      version: '1.0.0',
      description: 'A simple Express Ecommerce API',
    },
    servers: [
      {
        url:"https://task-management-system-api-y2zj.onrender.com/",
        description: "Development server reander"
    },
    {
        url: "http://localhost:3000",
        description: "Development server locally",
    }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 3000;

(async function startServer() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();

module.exports = app;
