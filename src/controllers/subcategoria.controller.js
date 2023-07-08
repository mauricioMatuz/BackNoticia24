import { sequelize } from "../database/database.js";
import { SubCategoria } from "../models/subcategoria.models.js";
import jwt from "jsonwebtoken";

export const CrearSubCategoria = async (req, res) => {
  try {
    const { subcategoria } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    const a = await SubCategoria.create({ subcategoria });
    return res.status(200).json({ message: "SubCategoria creado", a });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "ERROR SERVIDOR" });
  }
};

export const ActulizarSubCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    const subcategoria = SubCategoria.findOne({ where: { id } });
    if (subcategoria) {
      subcategoria.set(req.body);
      await subcategoria.save();
    } else {
      return res.status(200).json({ message: "No existe categoria" });
    }
    await t.commit();
    return res.status(200).json({ message: "Categoria actualizada" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "ERROR SERVIDOR" });
  }
};

export const BorrarSubCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    const decodedToken = jwt.verify(req.token, "administrador");
    const subcategoria = await SubCategoria.findOne({ where: { id } });
    if (subcategoria) {
      await SubCategoria.destroy({ where: { id } });
    } else {
      return res.status(200).json({ message: "No existe subcategoria" });
    }
    await t.commit();
    return res.status(200).json({ message: "subCategoria borrada" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "ERROR SERVIDOR" });
  }
};

export const SubCategorias = async (req, res) => {
  try {
    const subcategoria = await SubCategoria.findAll();
    return res.status(200).json({ subcategoria });
  } catch (error) {
    return res.status(500).json({ message: "ERROR SERVIDOR" });
  }
};
