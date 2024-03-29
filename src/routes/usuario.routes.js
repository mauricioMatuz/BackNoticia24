import { Router } from "express";
import cors from "cors";
import {
  ActualizarDatos,
  Borrar,
  Login,
  RegistrarAdministrador,
  RegistrarLector,
  Roles,
  BorrarEscritor,
  ListaEscritor,
  BuscarEscritor,
} from "../controllers/usuario.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (!bearerHeader) {
//     return res.sendStatus(403);
//   }

//   const bearerToken = bearerHeader.split(" ")[1];
//   req.token = bearerToken;
//   next();
// }

const router = Router();

router.use(cors());

router.post("/api/register/admi", verifyToken, RegistrarAdministrador);
router.post("/api/register", RegistrarLector);
router.put("/api/update/:id", verifyToken, ActualizarDatos);
router.post("/api/login", Login);
router.post("/api/rol", verifyToken, Roles);
router.get("/api/get", Borrar);
router.get("/api/escritor", verifyToken, ListaEscritor);
router.get("/api/find/escritor/:id", verifyToken, BuscarEscritor);
router.delete("/api/delete/escritor/:id", verifyToken, BorrarEscritor);
export default router;
