// config/db.js
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

async function connectToDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

module.exports = { sequelize, connectToDB };