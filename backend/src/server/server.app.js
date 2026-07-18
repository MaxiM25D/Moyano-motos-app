import express from "express";
import cors from "cors";

import environment, { validateEnv } from "../config/env.config.js";
import { connectAuto } from "../config/db/connect.config.js";
import { initRouters } from "../router/routes.js";

const app = express();
const PORT = environment.PORT;
let server;

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

export const startServer = async () => {
  const allowedOrigins = environment.CORS_ORIGIN
    ? environment.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : true;

  app.use(cors({ origin: allowedOrigins }));

  validateEnv();
  await connectAuto();
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  initRouters(app);

  server = app.listen(PORT, () =>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  );
};

export const getServer = () => server;
