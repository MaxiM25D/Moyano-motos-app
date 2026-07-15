import { sendError } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  return sendError(res, err);
};
