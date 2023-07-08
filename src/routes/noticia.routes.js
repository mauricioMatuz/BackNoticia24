import { Router } from "express";
import {
  ActualizarImagen,
  ActualizarNota,
  BorrarNota,
  CrearNota,
  Nota,
  Notas,
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

// //! Authorization: Bearer <token>
// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (typeof bearerHeader !== "undefined") {
//     const bearerToken = bearerHeader.split(" ")[1];
//     req.token = bearerToken;
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// }

const router = Router();

router.post(
  "/api/registrar/nota",
  verifyToken,
  uploads.array("foto"),
  cors(),
  CrearNota
);
router.get("/api/noticia", cors(), Notas);
router.put("/api/actualizar/nota", verifyToken, cors(), ActualizarNota);
router.post(
  "/api/actualizar/imagen",
  verifyToken,
  uploads.array("foto"),
  ActualizarImagen
);
router.delete("/api/borrar/noticia", cors(), verifyToken, BorrarNota);
router.get("/api/noticia/:id", cors(), Nota);
router.get("/api/noticias/escritor", verifyToken, cors(), VerNotaEscritor);
export default router;
