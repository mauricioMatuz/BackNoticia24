import { sequelize } from '../database/database.js';
import { SubCategoria } from '../models/subcategoria.models.js';
import { Op } from 'sequelize';

import jwt from 'jsonwebtoken';

export const CrearSubCategoria = async (req, res) => {
  try {
    const { Nuevacategoria } = req.body;
    const decodedToken = jwt.verify(req.token, 'administrador');
    await SubCategoria.create({ subcategoria: Nuevacategoria });
    return res.status(201).json({ message: 'Subcategoría creada' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR SERVIDOR' });
  }
};

export const ActulizarSubCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    const subcategoria = await SubCategoria.findOne({ where: { id } });
    if (subcategoria) {
      await subcategoria.update(req.body);
      await t.commit();
      return res
        .status(200)
        .json({ message: 'SubCategoría actualizada exitosamente' });
    } else {
      return res.status(404).json({ message: 'SubCategoría no encontrada' });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'ERROR SERVIDOR' });
  }
};

export const BorrarSubCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const decodedToken = jwt.verify(req.token, 'administrador');
    const subcategoria = await SubCategoria.findOne({ where: { id } });
    if (!subcategoria) {
      return res.status(404).json({ message: 'No existe subcategoria' });
    }
    await SubCategoria.destroy({ where: { id } });
    await t.commit();
    return res.status(200).json({ message: "Subcategoria borrada exitosamente" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json('ERROR SERVIDOR');
  }
};

export const SubCategorias = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, 'administrador');
    const subcategoria = await SubCategoria.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ subcategoria });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    return res.status(500).json({ message: 'ERROR SERVIDOR' });
  }
};

export const FindSubCategoria = async (req, res) => {
  const { q } = req.query;
  try {
    const subcategoria = await SubCategoria.findAll({
      where: {
        subcategoria: {
          [Op.like]: `%${q}%`,
        },
      },
    });

    if (subcategoria.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' });
    }

    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
      // Aquí podrías hacer más comprobaciones con el token si es necesario
      return res.status(200).json({ subcategoria });
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
