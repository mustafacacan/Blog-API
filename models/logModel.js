const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { log } = require("winston");
const { func } = require("joi");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    level: DataTypes.STRING,
    data: DataTypes.JSON,
  },
  { timestamps: false }
);

//sequelize.sync({ alter: true });

Log.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;

  return values;
};

module.exports = Log;
