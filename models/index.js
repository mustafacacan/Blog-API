const User = require("./userModel");
const Post = require("./postModel");
const Log = require("./logModel");
const Roles = require("./roles");
const UserRole = require("./userRole");
const Permissions = require("./permissions");
const RolePermissions = require("./rolePermissions");
const sequelize = require("../config/database");

User.hasMany(Post, { foreignKey: "createdBy", as: "admin" });

User.hasMany(Post, { foreignKey: "editorId", as: "editor" });

User.hasMany(Post, { foreignKey: "writerId", as: "writers" });

Post.belongsTo(User, { foreignKey: "createdBy", as: "admin" });

Post.belongsTo(User, { foreignKey: "editorId", as: "editor" });

Post.belongsTo(User, { foreignKey: "editorId", as: "writers" });

User.belongsToMany(Roles, { through: "UserRole", foreignKey: "userId" });
Roles.belongsToMany(User, { through: "UserRole", foreignKey: "roleId" });

Roles.belongsToMany(Permissions, {
  through: "RolePermissions",
  foreignKey: "roleId",
});
Permissions.belongsToMany(Roles, {
  through: "RolePermissions",
  foreignKey: "permissionId",
});

/** 
const permissions = [
  { name: "post_read" },
  { name: "post_create" },
  { name: "post_delete" },
  { name: "post_update" },
  { name: "user_read" },
  { name: "user_update" },
  { name: "user_delete" },
  { name: "editor_read" },
  { name: "editor_update" },
  { name: "editor_delete" },
];
const roles = [
  { roleName: "user" },
  { roleName: "editor" },
  { roleName: "admin" },
];

Roles.bulkCreate(roles, { ignoreDuplicates: true });
Permissions.bulkCreate(permissions, { ignoreDuplicates: true });


sequelize.sync({ alter: true });

 */

module.exports = {
  User,
  Post,
  Log,
  Roles,
  UserRole,
  RolePermissions,
  Permissions,
};
