import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Rol } from "./rol.models.js";

export const Usuarios = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: "root",
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: "root",
    },
    correo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      // defaultValue: "root@root",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: "root",
    },
     createdAt: {
      type: DataTypes.DATEONLY, // Utiliza DataTypes.DATEONLY en lugar de DataTypes.DATE
      defaultValue: DataTypes.NOW, // Establece la fecha actual por defecto
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

Usuarios.belongsTo(Rol, {
  foreignKey: "rolID",
  sourceKey: "id",
});



// Rol.hasMany(Usuarios, {
//   foreignKey: "rolID",
//   sourceKey: "id",
// });
