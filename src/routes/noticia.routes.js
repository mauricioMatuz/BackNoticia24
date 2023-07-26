import { Router } from "express";
import {
  ActualizarImagenes,
  ActualizarNota,
  BorrarNota,
  CrearNota,
  FindNotaTitulo,
  ListImageNota,
  Nota,
  Notas,
  VerNotaAdministrador,
  VerNotaEscritor,
} from "../controllers/noticia.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import cors from "cors";
import multer, { diskStorage } from "multer";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const union = join(CURRENT_DIR, "../uploads");
let uploads = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, union);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|JPEG,|png|PNG|jpg|JPG|gif|avif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("archivo no corresponde");
  },
});

const router = Router();

router.post(
  "/api/registrar/nota",
  verifyToken,
  uploads.array("images"),
  cors(),
  CrearNota
);
router.get("/api/noticias", cors(), Notas);
router.put(
  "/api/actualizr/nota",
  verifyToken,
  uploads.array("images"),
  cors(),
  ActualizarNota
);
router.put(
  "/api/actualizar/imagen",
  verifyToken,
  uploads.array("images"),
  ActualizarImagenes
);
router.delete("/api/borrar/noticia/:id/:rol", cors(), verifyToken, BorrarNota);
router.get("/api/noticia/:id", cors(), Nota);
router.get("/api/noticias/escritor", verifyToken, cors(), VerNotaEscritor);
// router.get(
//   "/api/noticias/administrador",
//   verifyToken,
//   cors(),
//   VerNotaAdministrador
// );
router.get("/api/buscar/nota", verifyToken, cors(), FindNotaTitulo);
router.get("/api/images", cors(), verifyToken, ListImageNota);
export default router;
