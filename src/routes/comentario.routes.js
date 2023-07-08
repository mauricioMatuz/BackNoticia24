import { Router } from "express";
import cors from "cors";
import {
  Mensajes,
  CreateComentario,
  Likes,
  DisLike,
} from "../controllers/comentarios.controller.js";

const router = Router();

//! Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
router.post("/api/comentarios/crear", verifyToken, cors(), CreateComentario);
router.get("/api/comentarios/nota", cors(), Mensajes);
router.post("/api/comentarios/:id/like", cors(), Likes);
router.post("/api/comentarios/:id/dislike", cors(), DisLike);

export default router;
