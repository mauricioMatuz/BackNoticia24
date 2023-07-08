import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Noticia } from "./noticia.models.js";

export const Items = sequelize.define(
  "items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      //   allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      //   allowNull: false,
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
