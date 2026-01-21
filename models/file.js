const { Sequelize, DataTypes } = require("sequelize");
// import sequelize connection
const sequelize = require("../config");
const User = require("./user");
const Course = require("./course");
const Task = require("./task");

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

// File belongs to User, Course, and Task
File.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
File.belongsTo(Course, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});
File.belongsTo(Task, {
  foreignKey: "task_id",
  onDelete: "CASCADE",
});

module.exports = File;
