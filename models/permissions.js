const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permissions = sequelize.define("Permissions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});

module.exports = Permissions;
