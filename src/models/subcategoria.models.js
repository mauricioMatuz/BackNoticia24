import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const SubCategoria = sequelize.define(
  "subcategoria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subcategoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // If don't want createdAt
    createdAt: true,

    // If don't want updatedAt
    updatedAt: false,
  }
);
