const jwt = require("jsonwebtoken");
const Response = require("../../services/response");
const { User } = require("../../models");
require("dotenv").config();

exports.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return new Response(null, "token not found").error404();
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(`jwt error occurred: ${error}`);
    return new Response(null, `jwt error occurred : ${error.message}`).error401(
      res
    );
  }
};

exports.isAdmin = async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findByPk(userId);

  if (user.role === "admin") {
    console.log(user.role);
    next();
  } else {
    return new Response(null, "you do not have access authority").error401(res);
  }
};
