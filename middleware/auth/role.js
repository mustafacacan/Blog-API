const { User, Permissions, Roles } = require("../../models");
const Response = require("../../services/response");

exports.checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: [
          {
            model: Roles,
            include: [{ model: Permissions }],
          },
        ],
      });

      if (!user) {
        return new Response(null, "user not found").error404(res);
      }

      const userPermissions = [];

      user.roles.forEach((role) => {
        role.permissions.forEach((permissions) => {
          userPermissions.push(permissions.name);
        });
      });

      if (!userPermissions.includes(requiredPermissions)) {
        return new Response(
          null,
          "You do not have permission to perform this action."
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
