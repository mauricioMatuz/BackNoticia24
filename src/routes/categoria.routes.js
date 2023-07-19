import { Router } from "express";
import cors from "cors";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  ActualizarCategoria,
  BorrarCategoria,
  Categorias,
  CrearCategoria,
  FindCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();
//! Authorization: Bearer <token>

router.get("/api/categorias", verifyToken, cors(), Categorias);
router.get("/api/buscar", verifyToken, cors(), FindCategoria);
router.post("/api/crear/categoria", verifyToken, cors(), CrearCategoria);
router.put(
  "/api/actualizar/categoria",
  verifyToken,
  cors(),
  ActualizarCategoria
);
router.delete(
  "/api/borrar/categoria/:id",
  verifyToken,
  cors(),
  BorrarCategoria
);
export default router;
