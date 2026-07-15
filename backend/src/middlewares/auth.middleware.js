import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/apiResponse.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, { status: 401, message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return sendError(res, { status: 401, message: "Token invalido o expirado" });
  }

  req.user = decoded;
  next();
};
