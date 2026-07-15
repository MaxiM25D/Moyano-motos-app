export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data
  });
};

export const sendError = (res, error) => {
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    message: error.message || "Error interno del servidor"
  });
};

export const sendValidationError = (res, errors) => {
  return res.status(400).json({
    status: "error",
    message: "Error de validacion",
    errors
  });
};
