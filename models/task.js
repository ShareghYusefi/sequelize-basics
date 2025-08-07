const { Sequelize, DataTypes } = require("sequelize");
// import sequelize connection
const sequelize = require("../config");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority_level: {
      // Enum data type allows a set of string values for the field
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Low",
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    timestamps: false,
  }
);

module.exports = Task;
