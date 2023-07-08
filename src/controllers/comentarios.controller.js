import { sequelize } from "../database/database.js";
import { Comentario } from "../models/comentarios.models.js";
import { Noticia } from "../models/noticia.models.js";
import { Usuarios } from "../models/usuario.models.js";
import jwt from "jsonwebtoken";

export const CreateComentario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { comentario, noticiaID, rol } = req.body;
    const decodedToken = await jwt.verify(req.token, rol);
    console.log(noticiaID, " esto es decoded");
    await Comentario.create(
      {
        comentario,
        noticiaID,
        usuarioId: decodedToken.user.id,
      },
      { transaction: t }
    );
    await t.commit();
    return res.status(201).json({ message: "Comentario agregado" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(400).json({ error });
  }
};

export const Mensajes = async (req, res) => {
  try {
    const comentario = await Comentario.findAll({
      include: [
        {
          model: Usuarios,
        },
        { model: Noticia },
      ],
    });
    return res.json({ comentario: comentario });
  } catch (error) {
    return res.json({ error: error });
  }
};

export const Likes = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Verificar si el usuario ya ha dado una interacción previa en este comentario
    const userInteraction = await UserCommentInteraction.findOne({
      where: { userId, commentId: id },
    });
    if (userInteraction) {
      return res
        .status(400)
        .json({ message: "El usuario ya ha interactuado con este comentario" });
    }

    // Incrementar el contador de likes del comentario
    comment.likes += 1;
    await comment.save();

    // Registrar la interacción del usuario con el comentario
    await UserCommentInteraction.create({
      userId,
      commentId: id,
      interactionType: "like",
    });
    await t.commit();
    return res.status(200).json({ message: "Like agregado al comentario" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const DisLike = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Verificar si el usuario ya ha dado una interacción previa en este comentario
    const userInteraction = await UserCommentInteraction.findOne({
      where: { userId, commentId: id },
    });
    if (userInteraction) {
      return res
        .status(400)
        .json({ message: "El usuario ya ha interactuado con este comentario" });
    }

    // Incrementar el contador de dislikes del comentario
    comment.dislikes += 1;
    await comment.save();

    // Registrar la interacción del usuario con el comentario
    await UserCommentInteraction.create({
      userId,
      commentId: id,
      interactionType: "dislike",
    });
    await t.commit();
    return res.status(200).json({ message: "Dislike agregado al comentario" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
