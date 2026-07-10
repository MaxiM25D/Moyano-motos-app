import express from "express";
import cors from "cors";

import environment, { validateEnv } from "../config/env.config.js";
import { connectAuto } from "../config/db/connect.config.js";
import { initRouters } from "../router/routes.js";


const app = express();
const PORT = environment.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const startServer = async () => {

  // Habilitar CORS
  app.use(cors());
  
  // Validar variables de entorno
  validateEnv();

  // Conectar DB
  await connectAuto();

  // Inicializar rutas
  initRouters(app);

  // Levantar servidor
  app.listen(PORT, () =>
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
  );
};
