import { Router } from "express";
import cors from "cors";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  ActulizarSubCategoria,
  BorrarSubCategoria,
  CrearSubCategoria,
  FindSubCategoria,
  SubCategorias,
} from "../controllers/subcategoria.controller.js";

const router = Router();

router.get("/api/subcategoria", verifyToken, cors(), SubCategorias);
router.get("/api/buscar/subcategoria", verifyToken, cors(), FindSubCategoria);
router.post("/api/crear/subcategoria", verifyToken, cors(), CrearSubCategoria);
router.put(
  "/api/actualizar/subcategoria",
  verifyToken,
  cors(),
  ActulizarSubCategoria
);
router.delete(
  "/api/borrar/subcategoria/:id",
  verifyToken,
  cors(),
  BorrarSubCategoria
);
export default router;
