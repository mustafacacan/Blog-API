const sequelize = require("../config/database");
const { User, Post, Log } = require("../models");
const Response = require("../services/response");

exports.getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const user = await User.findAndCountAll({
      limit,
      offset,
    });

    if (!user) {
      return new Response(null, "user not found").error404(res);
    }

    const totalPages = Math.ceil(user.count / limit);

    const response = {
      user: user.rows,
      totalPages,
      currentPage: page,
      totalUser: user.count,
    };

    return new Response(response, "all users brought").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching all users.: ${error}`);
    return new Response(
      null,
      `An error occurred while fetching all users: ${error.message}`
    );
  }
};

exports.restoreUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: false });

    if (!user) {
      return new Response(null, "user not found").error404(res);
    }

    await user.restore({ transaction });
    await transaction.commit();

    return new Response(user, "post was created").success(res);
  } catch (error) {
    await transaction.rollback();

    console.log(`An error occurred while creating the user: ${error}`);

    return new Response(
      null,
      `An error occurred while creating the user: ${error.message}`
    ).error500(res);
  }
};

// Completely deletes data that appears to be deleted from the database.
exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: true });

    await Post.destroy({ where: { id }, force: true, transaction });
    await user.destroy({ force: true, transaction });
    await transaction.commit();

    return new Response(null, "user completely deleted").success(res);
  } catch (error) {
    console.log(
      `An error occurred while completely deleting the user: ${error}`
    );
    return new Response(
      null,
      `An error occurred while completely deleting the user: ${error.message}`
    ).error500(res);
  }
};

// retrieves deleted users
exports.deletedUsers = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        isActive: false,
      },
      paranoid: false,
    });

    if (!user) {
      return new Response(null, "no deleted users");
    }

    return new Response(user, "all deleted users").success(res);
  } catch (error) {
    console.log(`An error occurred while retrieving deleted users: ${error}`);

    return new Response(
      null,
      `An error occurred while retrieving deleted users: ${error.message}`
    ).error500(res);
  }
};

exports.deletedPostsParanoid = async (req, res) => {
  try {
    const post = await Post.findAll({
      paranoid: true,
      where: {
        isActive: false,
      },
    });

    if (!post) {
      return new Response(null, "no deleted posts").error404(res);
    }

    return new Response(post, "all deleted posts").success(res);
  } catch (error) {
    console.log(`An error occurred while retrieving deleted posts: ${error}`);

    return new Response(
      null,
      `An error occurred while retrieving deleted posts: ${error.message}`
    ).error500(res);
  }
};

exports.postRestore = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { identifier } = req.params;

    const post = await Post.findOne({
      where: {
        slug: identifier,
        isActive: false,
      },
      paranoid: true,
    });

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    await post.restore({ transaction });
    await post.update({ isActive: true });
    await transaction.commit();

    return new Response(post, "post was created").success(res);
  } catch (error) {
    await transaction.rollback();

    console.log(`An error occurred while creating the post: ${error}`);

    return new Response(
      null,
      `An error occurred while creating the post: ${error.message}`
    ).error500(res);
  }
};

exports.deletePost = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { identifier } = req.params;

    const post = await Post.findOne({
      where: {
        slug: identifier,
      },
      paranoid: true,
    });

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    await post.destroy({ force: true, transaction });
    await transaction.commit();

    return new Response(null, "post completely deleted").success(res);
  } catch (error) {
    await transaction.rollback();

    console.log(
      `An error occurred while completely deleting the post: ${error}`
    );

    return new Response(
      null,
      `An error occurred while completely deleting the post: ${error.message}`
    ).error500(res);
  }
};

exports.getPendingPost = async (req, res) => {
  try {
    const post = await Post.findAll({
      where: { status: "pending" },
    });

    if (!post) {
      return new Response(null, "no pending posts").error404(res);
    }

    return new Response(post, "pending posts").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching pending posts: ${error}`);

    return new Response(
      null,
      `An error occurred while fetching pending posts: ${error.message}`
    ).error500(res);
  }
};

exports.postPublishedUpdate = async (req, res) => {
  const transaction = sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({
      where: { id, status: "pending" },
    });

    // if (!post) {
    //   return new Response(null, "no pending posts").error404(res);
    // }

    await post.update(
      req.body,
      {
        status: "published",
        createdBy: userId,
      },
      { transaction }
    );
    (await transaction).commit();

    return new Response(post, "This post is now active").success(res);
  } catch (error) {
    (await transaction).rollback();

    console.log(`An error occurred while updating the post: ${error}`);

    return new Response(
      null,
      `An error occurred while updating the post: ${error.message}`
    ).error500(res);
  }
};

exports.Logs = async (req, res) => {
  try {
    const logs = await Log.findAll();

    return new Response(logs, "all logs").success(res);
  } catch (error) {
    console.log(`An error occurred while fetching log records: ${error}`);
    return new Response(
      null,
      `An error occurred while fetching log records: ${error.message}`
    ).error500(res);
  }
};
