const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("task_manager", "root", "password", {
  host: "localhost",
  dialect: "mariadb",
});

module.exports = sequelize
