const { User, Post, UserRole, Roles, Permissions } = require("../models");
const jwt = require("jsonwebtoken");
const Response = require("../services/response");
const {
  registerSchema,
  loginSchema,
  updateSchema,
} = require("../middleware/validation/userValidate");
const sequelize = require("../config/database");
require("dotenv").config();

exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error403(res);
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (user) {
      return new Response(null, "this user exists").error422(res);
    }

    const newUser = await User.create(value, { transaction });

    const role = await Roles.findOne({
      where: {
        name: "user",
      },
    });

    const newRole = await UserRole.create({
      userId: newUser.id,
      roleId: role,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await transaction.commit();

    res.locals.newData = newUser.toJSON();

    return new Response(
      { newUser, token },
      "user registered successfully"
    ).create(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`An error occurred while registering: ${error}`);
    return new Response(
      null,
      `An error occurred while registering: ${error.message}`
    ).error500(res);
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error403(res);
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (!user) {
      return new Response(
        null,
        "Email address or password is incorrect"
      ).error400(res);
    }

    const isValidPassword = user.validPassword(value.password);

    if (!isValidPassword) {
      return new Response(
        null,
        "Email address or password is incorrect"
      ).error400(res);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.locals.oldData = user.toJSON();

    return new Response({ user, token }, "login successful").success(res);
  } catch (error) {
    console.log(`There was an error while logging in: ${error}`);
    return new Response(
      null,
      `There was an error while logging in: ${error.message}`
    ).error500(res);
  }
};

exports.update = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error403(res);
    }

    const user = await User.findByPk(req.user.id);

    res.locals.oldData = user.toJSON();

    if (!user) {
      return new Response(null, "user not found").error404(res);
    }

    await user.update(value, { transaction });

    res.locals.newData = user.toJSON();

    await transaction.commit();

    return new Response(user, "User information updated successfully").success(
      res
    );
  } catch (error) {
    await transaction.rollback();
    console.log(`An error occurred while updating user information.: ${error}`);
    return new Response(
      null,
      `An error occurred while updating user information.: ${error.message}`
    ).error500(res);
  }
};

exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return new Response(null, "user nor found").error404(res);
    }

    res.locals.oldData = user.toJSON();

    await Post.destroy({ where: { editorId: req.user.id }, transaction });
    await user.update({ isActive: false, transaction });
    await user.destroy({ transaction });

    await transaction.commit();

    return new Response(null, "user deleted successfully").success(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`An error occurred while deleting the user: ${error}`);
    return new Response(
      null,
      `An error occurred while deleting the user: ${error.message}`
    ).error500(res);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { paranoid: true });

    if (!user) {
      return new Response(null, "User not found").error404(res);
    }

    res.locals.oldData = user.toJSON();

    return new Response(user, "user information").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching user information.: ${error}`);
    return new Response(
      null,
      `An error occurred while fetching user information.: ${error.message}`
    );
  }
};

exports.getPostUserPublished = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const writerId = req.user.id;

    const post = await Post.findAndCountAll({
      where: { writerId, status: "published" },
      limit,
      offset,
    });

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    const totalPages = Math.ceil(post.count / limit);

    const response = {
      posts: post.rows,
      totalPages,
      currentPage: page,
      totalPost: post.count,
    };

    console.log(totalPages);

    return new Response(response, "All posts of the user").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching user's posts: ${error}`);
    return new Response(
      null,
      `An error occurred while fetching user's posts: ${error.message}`
    ).error500(res);
  }
};

exports.getPostUserPending = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const userId = req.user.id;

    const post = await Post.findAndCountAll({
      where: {
        writerId: userId,
        status: "pending",
      },
      limit,
      offset,
    });

    if (!post) {
      return new Response(null, "pending post not found").error404(res);
    }

    const totalPages = Math.ceil(post.count / limit);

    const response = {
      posts: post.rows,
      totalPages,
      currentPage: page,
      totalPost: post.count,
    };

    return new Response(response, "all pending posts").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching posts: ${error}`);

    return new Response(
      null,
      `An error occurred while fetching posts: ${error.message}`
    ).error500(res);
  }
};
