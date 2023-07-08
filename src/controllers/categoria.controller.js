import { sequelize } from "../database/database.js";
import { Categoria } from "../models/categoria.models.js";
import jwt from "jsonwebtoken";

export const CrearCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Nuevacategoria } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    await Categoria.create({
      categoria: Nuevacategoria,
    });
    await t.commit();
    return res.status(200).json({ message: "Categoria creada" });
  } catch (error) {
    await t.rollback();
    console.log("error ", error);
    return res.status(500).json({ message: "Error servidor" });
  }
};

export const ActualizarCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    const categoria = await Categoria.findOne({
      where: { id },
    });
    if (categoria) {
      categoria.set(req.body);
      await categoria.save();
      await t.commit();
      return res.status(200).json({ message: "Categoria actualizado" });
    } else {
      return res.status(404).json({ message: "Categoria no encontrado" });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "Error Servidor" });
  }
};

export const BorrarCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    const categoria = await Categoria.findOne({ where: { id } });
    if (categoria) {
      await Categoria.destroy({ where: { id } });
      await t.commit();
      return res.status(200).json({ message: "Categoria borrada" });
    } else {
      return res.status(200).json({ message: "No se encontro categoria" });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "Error servidor" });
  }
};

export const Categorias = async (req, res) => {
  try {
    const categoria = await Categoria.findAll();
    console.log(req.token, " esto es token :D");
    const decodedToken = jwt.verify(req.token, "administrador");
    return res.status(200).json({ categoria });
  } catch (error) {
    console.log(error, " error categorias");
    return res.status(500).json({ message: "ERROR" });
  }
};
