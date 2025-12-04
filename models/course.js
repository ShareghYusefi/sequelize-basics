const { Sequelize, DataTypes } = require("sequelize");
// import sequelize connection
const sequelize = require("../config");
const Task = require("./task");

const Course = sequelize.define(
  "Course",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    timestamps: false,
  }
);

module.exports = Course;
