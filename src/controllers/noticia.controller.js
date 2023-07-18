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

const eliminarArchivos = (archivos) => {
  archivos.forEach((archivo) => {
    fs.unlinkSync(archivo.path);
  });
};

export const CrearNota = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const files = req.files;
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
      return res.status(400).json({ message: "extensión de archivo inválida" });
    } else {
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
    return res
      .status(200)
      .json({ message: "nota creada", data: decodedToken.user });
  } catch (error) {
    await t.rollback();
    eliminarArchivos(req.files);
    console.log(error, " este error");
    return res.json({ message: "error" });
  }
};

export const ActualizarNota = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.body;
    const decodedToken = jwt.verify(req.token, rol);
    if (!decodedToken) {
      return res.status(401).json({ message: "Token invalido" });
    }
    const noticia = await Noticia.findOne({ where: { id } });
    if (noticia == null) {
      return res.status(404).json({ message: "No se encontro la nota" });
    } else {
      noticia.set(req.body);
      await noticia.save();
    }
    await t.commit();
    return res.status(200).json({ message: "Nota actualizada" });
  } catch (error) {
    await t.rollback();
    console.log(error, " error en catch");
    return res.status(500).json({ message: "error servidor" });
  }
};

export const ActualizarImagen = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.body;
    const files = req.files;
    const decodedToken = jwt.verify(req.token, rol);
    const noticia = await Noticia.findOne({
      where: { id },
    });
    if (!noticia) {
      return res.status(404).json({ message: "Nota no encontrada" });
    } else {
      const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
      const union = join(CURRENT_DIR, "../uploads");
      const items = await Items.findAll({
        where: {
          noticiaID: id,
        },
      });

      for (const item of items) {
        const foto = item.path.replace("http://localhost:8080/", "");
        const imgPath = join(union, "/", foto);
        await Items.destroy({ where: { id: item.id } });
        fs.unlinkSync(imgPath);
      }

      for (const file of files) {
        await Items.create(
          {
            nombre: file.originalname,
            path: "http://localhost:8080/" + file.filename,
            noticiaID: id,
          },
          { transaction: t }
        );
      }
    }
    await t.commit();
    return res.status(202).json({ message: "Imagenes actualizadas" });
  } catch (error) {
    console.log("error ", error, " <<<- try");
    await t.rollback();
    return res.status(401).json({ message: "Error Token" });
  }
};

export const BorrarNota = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id, rol } = req.body;
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Se requiere autorización" });
    }
    jwt.verify(req.token, rol);
    const noticia = await Noticia.findOne({ where: { id }, transaction: t });
    if (!noticia) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
    const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
    const union = join(CURRENT_DIR, "../uploads");
    const items = await Items.findAll({ where: { noticiaID: id } });

    for (const item of items) {
      const imgPath = path.join(
        union,
        "..",
        "uploads",
        item.path.replace("http://localhost:8080/", "")
      );
      fs.unlinkSync(imgPath);
    }

    await Items.destroy({ where: { noticiaID: id }, transaction: t });
    await Noticia.destroy({ where: { id }, transaction: t });

    await t.commit();
    return res.status(200).json({ message: "Noticia eliminada" });
  } catch (error) {
    await t.rollback();
    console.log("error ", error);
    return res.status(401).json({ message: "Error token" });
  }
};

export const Nota = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, " id ", req.params.id);

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
      return res.status(200).json({ message: noticia });
    } else {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
  } catch (error) {
    console.log("error ", error);
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
        { model: Comentario },
      ],
    });
    return res.status(200).json({ noticias });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};


export const VerNotaEscritor = async (req, res) => {
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
    return res.status(200).json({ message: noticia });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({ message: "Error servidor em escritor" });
  }
};

export const NotaTitulo = async (req, res) => {
  try {
    const { titulo } = req.body;
    const noticia = await Noticia.findAll({
      where: { titulo },
      include: [
        { model: Items },
        { model: Categoria },
        { model: SubCategoria },
      ],
    });
  } catch (error) {}
};
