const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserRole = sequelize.define("UserRole", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserRole;
