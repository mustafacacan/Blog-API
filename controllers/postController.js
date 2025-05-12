const { Post, User } = require("../models");
const {
  createSchema,
  updateSchema,
} = require("../middleware/validation/postValidate");
const sequelize = require("../config/database");
const Response = require("../services/response");
const { editor } = require("../middleware/auth/authenticate");

exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error403(res);
    }

    const writerId = req.user.id;

    const post = await Post.create(
      {
        ...value,
        writerId,
        editorId: writerId,
      },
      { transaction }
    );

    res.locals.newData = post.toJSON();

    await transaction.commit();

    return new Response(post, "post added").create(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`An error occurred while adding the post: ${error}`);
    return new Response(
      null,
      `An error occurred while adding the post: ${error.message}`
    ).error500(res);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const status = await Post.findOne({
      where: { status: "published" },
    });

    if (status) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const post = await Post.findAndCountAll({
        where: {
          status: "published",
        },

        limit,
        offset,
      });

      if (!post) {
        return new Response(null, "post not found").error404(res);
      }

      const totalPages = Math.ceil(post.count / limit);

      const response = {
        post: post.rows,
        totalPages,
        currentPage: page,
        totalPosts: post.count,
      };

      return new Response(response, "all posts brought").success(res);
    } else {
      return new Response(null, "post not found").error404(res);
    }
  } catch (error) {
    console.log(`An error occurred while fetching posts: ${error}`);

    return new Response(
      null,
      `An error occurred while fetching posts: ${error.message}`
    ).error500(res);
  }
};

exports.getPost = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { identifier } = req.params;

    const post = await Post.findOne({
      where: { slug: identifier, status: "published" },
      include: [
        {
          model: User,
          as: "writers",
          attributes: { exclude: ["role", "createdAt", "updatedAt"] },
        },
      ],
    });

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    await post.update({
      readingCount: post.readingCount + 1,

      transaction,
    });
    await transaction.commit();

    return new Response(post, "post fetched successfully").success(res);
  } catch (error) {
    await transaction.rollback();

    console.log(`An error occurred while fetching the post: ${error}`);

    return new Response(
      null,
      `An error occurred while fetching the post: ${error.message}`
    ).error500(res);
  }
};

exports.update = async (req, res) => {
  const transaction = sequelize.transaction();
  try {
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error403(res);
    }

    const { identifier } = req.params;

    const userId = req.user.id;

    const post = await Post.findOne({
      where: {
        slug: identifier,
        writerId: userId,
        status: "published",
      },
    });

    res.locals.oldData = post.toJSON();

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    await post.update({ ...value, transaction });
    (await transaction).commit();

    return new Response(post, "post updated successfully").success(res);
  } catch (error) {
    (await transaction).rollback();

    console.log(`An error occurred while updating the post: ${error}`);

    return new Response(
      null,
      `An error occurred while updating the post: ${error}`
    ).error500(res);
  }
};

exports.deletePost = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { identifier } = req.params;

    const userId = req.user.id;

    const post = await Post.findOne({
      where: {
        slug: identifier,
        writerId: userId,
      },
    });

    if (!post) {
      return new Response(null, "post not found").error404(res);
    }

    res.locals.oldData = post.toJSON();

    await post.update({ isActive: false });
    await post.destroy({ transaction });
    await transaction.commit();

    return new Response(null, "post deleted successfully").success(res);
  } catch (error) {
    await transaction.rollback();

    console.log(`An error occurred while deleting the post: ${error}`);

    return new Response(
      null,
      `An error occurred while deleting the post: ${error.message}`
    ).error500(res);
  }
};
