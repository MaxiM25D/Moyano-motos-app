import { sendValidationError } from "../utils/apiResponse.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(err => err.message);
    return sendValidationError(res, errors);
  }

  next();
};
