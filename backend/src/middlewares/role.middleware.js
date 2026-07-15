import { sendError } from "../utils/apiResponse.js";

export const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, { status: 403, message: "Acceso denegado" });
  }

  next();
};
