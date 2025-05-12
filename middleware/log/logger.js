const { Log } = require("../../models");
require("dotenv").config();

const logMiddleware = async (req, res, next) => {
  try {
    res.on("finish", async () => {
      const { oldData, newData } = res.locals;

      if (req.method === "GET") {
        return;
      }

      await Log.create({
        userId: req.user?.id,
        level: process.env.LOG_LEVEL || "info",
        timestamp: new Date(Date.now()),
        data: {
          procType: req.method, 
          route: req.originalUrl,
          statusCode: res.statusCode,
          oldData,
          newData,
        },
      });
    });
  } catch (error) {
    console.log(`Log error: ${error}`);
  }

  next();
};

module.exports = logMiddleware;
