import { logger } from "../../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger?.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Something went wrong" : err.message,
  });
};
