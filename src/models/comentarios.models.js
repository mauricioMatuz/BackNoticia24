import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuarios } from "./usuario.models.js";
import { Noticia } from "./noticia.models.js";

export const Comentario = sequelize.define(
  "comentario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: false,
      refences: {
        model: Usuarios,
        key: "id",
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dislike: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
  }
);

Comentario.belongsTo(Usuarios, {
  foreingKey: "usuarios_id",
  targetId: "id",
});

Usuarios.hasMany(Comentario, {
  foreingKey: "comentario_id",
  sourceKey: "id",
});

Comentario.belongsTo(Noticia, {
  foreignKey: "noticiaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

Noticia.hasMany(Comentario, {
  foreignKey: "noticiaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});
