const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({ force: false });
    console.log("database connection successful");
  })
  .catch((error) => {
    console.log("database connection failed", error);
  });

module.exports = sequelize;
