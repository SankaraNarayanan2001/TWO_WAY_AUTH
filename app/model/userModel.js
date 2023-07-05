const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
