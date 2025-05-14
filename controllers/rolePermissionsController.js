const sequelize = require("../config/database");
const {
  Roles,
  Permissions,
  User,
  UserRole,
  RolePermissions,
} = require("../models");
const Response = require("../services/response");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const roles = await Roles.create({ name });

    if (!name) {
      return new Response(null, "name is required").error400(res);
    }

    return new Response(roles, "role is created successfully").success(res);
  } catch (error) {
    console.log(`An error occurred while adding a role: ${error}`);
    return new Response(
      null,
      `An error occurred while adding a role: ${error.message}`
    ).error500(res);
  }
};

exports.createPermissions = async (req, res) => {
  try {
    const { name } = req.body;

    const permission = await Permissions.create({ name });

    if (!name) {
      return new Response(null, "name is required").error400(res);
    }

    return new Response(permission, "permission is created successfully");
  } catch (error) {
    console.log(`An error occurred while adding a permission: ${error}`);
    return new Response(
      null,
      `An error occurred while adding a permission: ${error.message}`
    );
  }
};

exports.addPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    const role = await Roles.findByPk(roleId);
    const permission = await Permissions.findByPk(permissionId);

    if (!role && !permission) {
      return new Response(null, "role or permission not found").error404(res);
    }

    console.log(role, permission);

    const response = await RolePermissions.create({
      roleId: role.id,
      permissionId: permission.id,
    });

    return new Response(response, "permission added to role").create(res);
  } catch (error) {
    console.log(`Error occurred while adding permission to role: ${error}`);
    return new Response(
      null,
      `Error occurred while adding permission to role: ${error.message}`
    ).error500(res);
  }
};

exports.addRoleToUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Roles.findByPk(roleId);

    if (!user && !role) {
      return new Response(null, "user or role not found").error404(res);
    }

    const users = await UserRole.findOne({
      where: {
        userId: userId,
      },
    });

    await users.update(
      {
        roleId: role.id,
      },
      { transaction }
    );

    await transaction.commit();

    return new Response(users, "role assigned to user").create(res);
  } catch (error) {
    await transaction.rollback();
    console.log(
      `An error occurred while assigning the role to the user: ${error}`
    );
    return new Response(
      null,
      `An error occurred while assigning the role to the user:${error.messaage}`
    ).error500(res);
  }
};

exports.removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Roles.findByPk(roleId);

    if (!user && !role) {
      return new Response(null, `user or role not found`).error404(res);
    }

    await UserRole.destroy({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

    return new Response(null, "role removed from user").success(res);
  } catch (error) {
    console.log(`Error occurred while removing role from user: ${error}`);
    return new Response(
      null,
      `Error occurred while removing role from user: ${error.messaage}`
    ).error500(res);
  }
};

exports.getRoleUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const roles = await User.findAndCountAll({
      include: [
        {
          model: Roles,
          attributes: ["id", "roleName"],
          through: {
            attributes: [],
          },
        },
      ],
      limit,
      offset,
    });

    const totalPages = Math.ceil(roles.count / limit);

    const response = {
      roles: roles.rows,
      totalPages,
      currentPages: page,
      totalRole: roles.count,
    };

    return new Response(response, "All roles to user").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching roles: ${error}`);
    return new Response(
      null,
      `An error occurred while fetching roles: ${error.messaage}`
    ).error500(res);
  }
};

exports.getAllRolesAndPermissions = async (req, res) => {
  try {
    const roles = await Roles.findAll({
      include: [
        {
          model: Permissions,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return new Response(
      roles,
      "All roles and permissions were successfully fetched"
    ).success(res);
  } catch (error) {
    console.log(`Error while getting all roles and permissions: ${error}`);
    return new Response(
      null,
      `Error while getting all roles and permissions: ${error.message}`
    ).error500(res);
  }
};
