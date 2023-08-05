import { sequelize } from "../database/database.js";
import { Noticia } from "../models/noticia.models.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { Items } from "../models/item.models.js";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Categoria } from "../models/categoria.models.js";
import { SubCategoria } from "../models/subcategoria.models.js";
import { Comentario } from "../models/comentarios.models.js";
import { Op } from "sequelize";

const eliminarArchivos = (archivos) => {
  archivos.forEach((archivo) => {
    fs.unlinkSync(archivo.path);
  });
};

export const CrearNota = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const files = req.files;
    console.log("FILES ", req.files);
    const date = new Date();
    const meses = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fechaPublicacion =
      (month < 10 ? "0" : "") + day + "-" + meses[month - 1] + "-" + year;

    const { titulo, descripcion, categoriaID, subcategoriaID, rol } = req.body;
    const decodedToken = jwt.verify(req.token, rol);
    const noticia = await Noticia.create(
      {
        titulo,
        descripcion,
        fecha: fechaPublicacion,
        categoriaID,
        subcategoriaID,
        autor: decodedToken.user.nombre + " " + decodedToken.user.apellido,
      },
      { transaction: t }
    );

    if (!files) {
      await t.rollback();
    } else {
      console.log(files, " por que entro si llego vacio");
      await Promise.all(
        files.map(async (file) => {
          await Items.create(
            {
              nombre: file.originalname,
              path: "http://localhost:8080/" + file.filename,
              noticiaID: noticia.id,
            },
            { transaction: t }
          );
        })
      );
    }

    await t.commit();
    return res.status(201).json({ message: "Nota creada" });
  } catch (error) {
    await t.rollback();
    console.log("error ", error);
    if (req.files) eliminarArchivos(req.files);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const ListImageNota = async (req, res) => {
  try {
    const { id, rol } = req.body;
    try {
      const decodedToken = jwt.verify(req.token, rol);
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const noticia = await Noticia.findOne({ where: { id } });
    if (!noticia) {
      return res.status(404).json({ message: "No se encontró la nota" });
    } else {
      const item = await Items.findOne({ where: { noticiaID: id } });
      return res.status(200).json({ message: item });
    }
  } catch (error) {}
};

export const ActualizarImagenes = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.body;
    const files = req.files;
    try {
      const decodedToken = jwt.verify(req.token, rol);
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const noticia = await Noticia.findOne({ where: { id } });
    if (!noticia) {
      return res.status(404).json({ message: "No se encontró la nota" });
    } else {
      await Items.destroy({ where: { noticiaID: id }, transaction: t });
      const newItems = files.map((file) => {
        return {
          nombre: file.originalname,
          path: "http://localhost:8080/" + file.filename,
          noticiaID: id,
        };
      });
      await Items.bulkCreate(newItems, { transaction: t });
      await t.commit();
      return res.status(200).json({ message: "Imágenes actualizadas" });
    }
  } catch (error) {
    await t.rollback();
    console.log(error, " este es el error al actualizar las imágenes");
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const ActualizarNota = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.body;
    console.log("ID DE NOTA ", id, " rol ", rol);
    const files = req.files;
    try {
      const decodedToken = jwt.verify(req.token, rol);
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const noticia = await Noticia.findOne({ where: { id } });
    if (!noticia) {
      return res.status(404).json({ message: "No se encontró la nota" });
    } else {
      noticia.set(req.body);

      // Eliminar todas las imágenes asociadas a la nota
      await Items.destroy({ where: { noticiaID: id }, transaction: t });

      // Crear las nuevas imágenes
      const newItems = files.map((file) => {
        return {
          nombre: file.originalname,
          path: "http://localhost:8080/" + file.filename,
          noticiaID: id,
        };
      });
      await Items.bulkCreate(newItems, { transaction: t });

      await noticia.save();
    }
    await t.commit();
    return res.status(200).json({ message: "Nota actualizada" });
  } catch (error) {
    await t.rollback();
    console.log(error, " este es el error al actualizar we");
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const BorrarNota = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.params;
    const token = req.headers.authorization;
    try {
      jwt.verify(req.token, rol);
    } catch (error) {
      return res.status(401).json({ message: "Se requiere autorización" });
    }
    console.log("id", id, "\nrol", rol);
    const noticia = await Noticia.findOne({ where: { id }, transaction: t });
    if (!noticia) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
    await Noticia.destroy({ where: { id }, transaction: t });

    await t.commit();
    return res.status(200).json({ message: "Noticia eliminada" });
  } catch (error) {
    console.log("error error", error);
    await t.rollback();
    return res.status(500).json({ message: "Error Servidor" });
  }
};

export const Nota = async (req, res) => {
  try {
    const id = req.params.id;

    const noticia = await Noticia.findOne({
      where: { id },
      include: [
        { model: Items },
        { model: Categoria },
        { model: SubCategoria },
        { model: Comentario },
      ],
    });

    if (noticia) {
      return res.status(200).json({ noticia });
    } else {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const Notas = async (req, res) => {
  try {
    const noticias = await Noticia.findAll({
      include: [
        { model: Items },
        { model: Categoria },
        { model: SubCategoria },
      ],
      order: [["id", "ASC"]],
    });
    return res.status(200).json({ noticias });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const VerNotaEscritor = async (req, res) => {
  try {
    try {
      const decodedToken = jwt.verify(req.token, "escritor");
      const noticia = await Noticia.findAll({
        where: {
          autor: decodedToken.user.nombre + " " + decodedToken.user.apellido,
        },
        include: [
          { model: Items },
          { model: Categoria },
          { model: SubCategoria },
        ],
      });
      return res.status(200).json({ noticia });
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const VerNotaAdministrador = async (req, res) => {
  try {
    try {
      const decodedToken = jwt.verify(req.token, "administrador");
      const noticia = await Noticia.findAll({
        where: {
          autor: decodedToken.user.nombre + " " + decodedToken.user.apellido,
        },
        include: [
          { model: Items },
          { model: Categoria },
          { model: SubCategoria },
        ],
      });
      return res.status(200).json({ noticia });
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const FindNotaTitulo = async (req, res) => {
  const { q } = req.query;
  try {
    const noticia = await Noticia.findAll({
      where: { titulo: { [Op.like]: `%${q}%` } },
      include: [
        { model: Items },
        { model: Categoria },
        { model: SubCategoria },
      ],
    });
    if (noticia.length === 0) {
      return res.status(404).json({ message: "No se encontraron categorías" });
    }
    return res.status(200).json({ noticia });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
