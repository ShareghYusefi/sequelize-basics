const { Sequelize } = require("sequelize");
require("dotenv").config();

// Process environment variable will refer to .env for development.
// We will set new values in render for production.
const DB_HOSTNAME = process.env.DB_HOSTNAME;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_PORT = process.env.DB_PORT;

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOSTNAME,
  dialect: DB_DIALECT,
  port: DB_PORT,
});

module.exports = sequelize;
