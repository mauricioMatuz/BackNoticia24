import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Like = sequelize.define(
  "likes",
  {
    mensajeID: {
      type: DataTypes.INTEGER,
      references: {
        model: Comentario,
        key: "id",
      },
    },
    usuarioID: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuarios,
        key: "id",
      },
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

Like.associate = function (models) {
  models.Usuarios.belongsToMany(models.Comentario, {
    through: models.Like,
    foreignKey: "usuariosID",
    otherKey: "comentarioID",
  });

  models.Comentario.belongsToMany(models.Usuarios, {
    through: models.Like,
    foreignKey: "comentarioID",
    otherKey: "usuarioID",
  });

  models.Like.belongsTo(models.Usuario, {
    foreignKey: "usuariosID",
    as: "usuarios",
  });
  models.Like.belongsTo(models.Comentario, {
    foreignKey: "comentarioID",
    as: "comentarios",
  });
};
