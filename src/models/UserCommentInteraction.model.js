import { DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import { Usuarios } from "./usuario.models";
import { Comentario } from "./comentarios.models";

const UserCommentInteraction = sequelize.define("UserCommentInteraction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuarios,
      key: "id",
    },
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comentario,
      key: "id",
    },
  },
  interactionType: {
    type: DataTypes.ENUM("like", "dislike"),
    allowNull: false,
  },
});
