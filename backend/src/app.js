import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { requestLogger } from "./shared/middlewares/requestLogger.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { AppError } from "./shared/errors/AppError.js";
import prisma from "./shared/db/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import friendRoutes from "./modules/friends/friend.routes.js";
import contentRoutes from "./modules/content/content.routes.js";
import { apiLimiter, authLimiter } from "./shared/middlewares/rateLimit.js";
import { correlationId } from "./shared/middlewares/correlationId.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(correlationId);
app.use(helmet());
app.use((req, res, next) => {
  res.setTimeout(30 * 1000, () => {
    res.status(503).json({ message: "Request timeout" });
  });
  next();
});

app.use("/api", apiLimiter);
app.use("/auth", authLimiter, authRoutes);
app.use("/users", userRoutes);
app.use("/friends", friendRoutes);
app.use("/collections", contentRoutes);

app.get("/", (req, res)=> {
  res.json({ message: "Hello World!" });
})

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/error-test", (req, res, next) => {
  next(new AppError("Deliberate Error for testing", 400, true));
});

app.get("/db-test", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

export default app;
