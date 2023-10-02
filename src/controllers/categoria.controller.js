import { sequelize } from '../database/database.js';
import { Categoria } from '../models/categoria.models.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const CrearCategoria = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Nuevacategoria } = req.body;
    // Verificar el token y manejar errores si no es válido
    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
      // Aquí podrías hacer más comprobaciones con el token si es necesario
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    await Categoria.create({
      categoria: Nuevacategoria,
    });
    await t.commit();
    return res.status(200).json({ message: 'Categoria creada' });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
export const ActualizarCategoria = async (req, res) => {
  console.log("Entra a actualizar categoria");
  
  const t = await sequelize.transaction();
  try {
    const { id,Nuevacategoria } = req.body;
    console.log("Estamos en controller categoria: ",id);
    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    const categoria = await Categoria.findOne({
      where: { id },
    });
    if (categoria) {
      console.log("Dentro del if:",req.body);
      const updatedCategoria = await categoria.update(req.body);
      //await categoria.update(req.body);
      await t.commit();
      return res
        .status(200)
        .json({
          message: "Categoría actualizada exitosamente",
          updatedCategoria,
        });
    } else {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const BorrarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    let decodedToken;
    try {
      decodedToken = jwt.verify(req.token, 'administrador');
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'No se encontró la categoría' });
    }

    await Categoria.destroy({ where: { id } });
    return res.status(200).json({ message: 'Categoría borrada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const Categorias = async (req, res) => {
  try {
    const categoria = await Categoria.findAll({ order: [['id', 'ASC']] });
    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
      // Aquí podrías hacer más comprobaciones con el token si es necesario
      return res.status(200).json({ categoria });
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'ERROR' });
  }
};

export const FindCategoria = async (req, res) => {
  const { q } = req.query;
  try {
    const categoria = await Categoria.findAll({
      where: {
        categoria: {
          [Op.like]: `%${q}%`,
        },
      },
    });

    if (categoria.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' });
    }

    try {
      const decodedToken = jwt.verify(req.token, 'administrador');
      // Aquí podrías hacer más comprobaciones con el token si es necesario
      return res.status(200).json({ categoria });
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
