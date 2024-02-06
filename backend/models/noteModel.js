const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Note = sequelize.define("Note", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  categories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

module.exports = Note;
