const {
  Permissions,
  RolePermissions,
  UserRole,
  User,
  Roles,
} = require("../../models");
const Response = require("../../services/response");

const checkPermissions = (permissionName) => {
  return async (req, res, next) => {
    try {
      const permission = await Permissions.findOne({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        return new Response(null, `permission not found`).error404(res);
      }

      const userId = req.user.id;

      const userRole = await UserRole.findOne({
        where: {
          userId,
        },
      });

      console.log(userRole.roleId);

      const rolePermission = await RolePermissions.findOne({
        where: {
          roleId: userRole.roleId,
          permissionId: permission.id,
        },
      });

      if (!rolePermission) {
        return new Response(
          null,
          `You do not have permission to perform this operation.`
        ).error401(res);
      }

      next();
    } catch (error) {
      console.log(`authorization check error: ${error}`);
      return new Response(
        null,
        `authorization check error: ${error.message}`
      ).error500(res);
    }
  };
};

module.exports = checkPermissions;
