const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db.config');

const Category = sequelize.define('Categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Category;
