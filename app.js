const express = require('express');
const { sequelize, connectToDB } = require('./config/db.config');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the Basic Ecommerce Platform" });
});

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
