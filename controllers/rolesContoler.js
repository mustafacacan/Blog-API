const { User, Roles, UserRole } = require("../models");
const Response = require("../services/response");

const createUserRole = async (req, res) => {
  try {
    const userId = req.body;
    const roleId = req.body;

    const user = await User.findByPk(userId);
    const role = await Roles.findByPk(roleId);

    if (!user && role) {
      return new Response(null, "user or role id not found").error404(res);
    }

    await UserRole.create({
      userId: user,
      roleId: role,
      createdBy: req.user?.id,
    });

    return new Response(null, "permission assigned to user").create(res);
  } catch (error) {
    console.log(`An error occurred while assigning permission: ${error}`);
    return new Response(
      null,
      `An error occurred while assigning permission: ${error}`
    ).error500(res);
  }
};
