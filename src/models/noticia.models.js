import { DataTypes, literal } from "sequelize";
import { sequelize } from "../database/database.js";
import { Comentario } from "./comentarios.models.js";
import { Categoria } from "./categoria.models.js";
import { SubCategoria } from "./subcategoria.models.js";
import { Items } from "./item.models.js";

export const Noticia = sequelize.define(
  'noticia',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY, // Utiliza DataTypes.DATEONLY en lugar de DataTypes.DATE
      defaultValue: DataTypes.NOW, // Establece la fecha actual por defecto
    },
    //! videos (galeria)

    //? filtros (fecha,mas like, mas dislike, mas comentarios)
    //? busqueda por titulo
    // notificaciones de notas (solo admi)
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // If don't want createdAt
    createdAt: true,

    // If don't want updatedAt
    updatedAt: false,
  },
);

Items.belongsTo(Noticia, {
  foreignKey: "noticiaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});
Noticia.hasMany(Items, {
  foreignKey: "noticiaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

Noticia.belongsTo(Categoria, {
  foreignKey: "categoriaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

Categoria.hasMany(Noticia, {
  foreignKey: "categoriaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

Noticia.belongsTo(SubCategoria, {
  foreignKey: "subcategoriaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

SubCategoria.hasMany(Noticia, {
  foreignKey: "subcategoriaID",
  sourceKey: "id",
  onUpdate: "CASCADE",
});

