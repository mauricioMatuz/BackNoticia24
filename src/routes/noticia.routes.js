import { Router } from 'express';
import {
  ActualizarImagenes,
  ActualizarNota,
  BorrarNota,
  CrearNota,
  FindNotaPorCategoria,
  FindNotaTitulo,
  ListImageNota,
  Nota,
  Notas,
  FindNotaPorCategoriaParam,
  VerNotaEscritor,
  VerNotaFecha,
  Prueba,
} from '../controllers/noticia.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import cors from 'cors';
import multer, { diskStorage } from 'multer';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const union = join(CURRENT_DIR, '../uploads');
if (!fs.existsSync(union)) {
  try {
    fs.mkdirSync(union);
  } catch (error) {
    console.error('Error al crear la carpeta de destino:', error);
  }
}
let uploads = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, union);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|JPEG|png|PNG|jpg|JPG|gif|avif|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('archivo no corresponde');
  },
});

const router = Router();

router.post(
  '/api/registrar/nota',
  verifyToken,
  uploads.array('images'),
  cors(),
  CrearNota,
);
router.get('/api/noticias', cors(), Notas);
router.put(
  '/api/actualizar/nota/:id', // Define un parámetro de ruta para el ID
  verifyToken,
  uploads.array('images'),
  cors(),
  ActualizarNota,
);
router.post(
  '/api/actualizar/imagen',
  verifyToken,
  uploads.array('images'),
  ActualizarImagenes,
);
router.delete('/api/borrar/noticia/:id/:rol', cors(), verifyToken, BorrarNota);
router.get('/api/noticia/:id', cors(), Nota);
router.get('/api/noticias/escritor/:rol', verifyToken, cors(), VerNotaEscritor);
router.get('/api/noticias/fecha/:rol', verifyToken, cors(), VerNotaFecha);
router.get('/api/buscar/nota', cors(), FindNotaTitulo);
router.get('/api/findby/categoria', cors(), FindNotaPorCategoria);
router.get('/api/findby/:categoria', cors(), FindNotaPorCategoriaParam);
router.get('/api/images', cors(), verifyToken, ListImageNota);
router.get('/api/prueba/:fecha', cors(), Prueba);
export default router;
