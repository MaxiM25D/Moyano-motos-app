import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { User } from "../models/user.model.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};