const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RolePermissions = sequelize.define("RolePermissions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = RolePermissions;
