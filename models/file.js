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
    fileable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileable_type: {
      type: DataTypes.STRING,
      allowNull: false,
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

// Course has many Files
Course.hasMany(File, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "cover", // as alias for loading related files in queries
});

// User has many Files
User.hasMany(File, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "files",
});

// Task has many Files
Task.hasMany(File, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "files",
});

// File belongs to User, Course, and Task
File.belongsTo(User, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "user", // as alias for loading related user in queries
  scope: {
    fileable_type: "User",
  },
});
File.belongsTo(Course, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "course",
  scope: {
    fileable_type: "Course",
  },
});
File.belongsTo(Task, {
  foreignKey: "fileable_id",
  constraints: false,
  as: "task",
  scope: {
    fileable_type: "Task",
  },
});

module.exports = File;
