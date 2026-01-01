import jwt from "jsonwebtoken";
import { AppError } from "../shared/errors/AppError.js";

export const verifyAccessToken = async (req) => {
  const url = new URL(req.url, "http://localhost");
  const token =
    url.searchParams.get("token") ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) throw new Error("Unauthorized");

  const payload = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
  );

  return {
    id: payload.sub,
    role: payload.role
  };
};
