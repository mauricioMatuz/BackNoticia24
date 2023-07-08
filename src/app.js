import express from "express";
import morgan from "morgan";

import usuarios from "./routes/usuario.routes.js";
import comentario from "./routes/comentario.routes.js";
import noticia from "./routes/noticia.routes.js";
import categoria from "./routes/categoria.routes.js";
import subcategoria from "./routes/subcategoria.routes.js";

import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const union = join(CURRENT_DIR, "/uploads");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(express.static(union));

app.use(usuarios);
app.use(comentario);
// app.use(noticia, fileServe("./uploads",__dirname + "\\uploads"));
app.use(noticia);
app.use(categoria);
app.use(subcategoria);

export default app;
