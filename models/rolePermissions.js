const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RolePermissions = sequelize.define("RolePermissions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: DataTypes.INTEGER,
  permissionId: DataTypes.INTEGER,
});

module.exports = RolePermissions;
