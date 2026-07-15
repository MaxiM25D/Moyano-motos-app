import express from "express";
import cors from "cors";

import environment, { validateEnv } from "../config/env.config.js";
import { connectAuto } from "../config/db/connect.config.js";
import { initRouters } from "../router/routes.js";

const app = express();
const PORT = environment.PORT;
let server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const startServer = async () => {
  app.use(cors());

  validateEnv();
  await connectAuto();
  initRouters(app);

  server = app.listen(PORT, () =>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  );
};

export const getServer = () => server;
