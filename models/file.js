const { DataTypes } = require("sequelize");
// import sequelize connection
const sequelize = require("../config");

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // id of the course or task
    fileable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // course or task
    fileable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Files",
    timestamps: false,
  }
);

// Polymorphic association setup
File.associate = (models) => {
  File.belongsTo(models.Course, {
    foreignKey: "fileable_id",
    constraints: false,
    as: "course",
    scope: {
      fileable_type: "Course",
    },
  });

  File.belongsTo(models.Task, {
    foreignKey: "fileable_id",
    constraints: false,
    as: "task",
    scope: {
      fileable_type: "Task",
    },
  });
};

module.exports = File;
