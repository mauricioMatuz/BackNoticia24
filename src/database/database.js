import Sequelize from "sequelize";

export const sequelize = new Sequelize("prueba1", "postgres", "191214", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});
