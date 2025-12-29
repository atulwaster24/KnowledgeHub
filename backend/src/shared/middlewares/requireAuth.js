import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { env } from "../../config/env.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      throw new AppError("Unauthorized or Forbidden", 403);
    }
    next();
  };
};
