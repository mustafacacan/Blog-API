const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { object } = require("joi");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    editorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    writerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "published"),
      defaultValue: "pending",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    deletedAt: true,
    // freezeTableName
  }
);

Post.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.deletedAt;
  return values;
};

//sequelize.sync({ alter: true });

module.exports = Post;
