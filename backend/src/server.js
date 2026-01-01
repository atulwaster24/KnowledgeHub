import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { initSocketServer } from "./realtime/socketServer.js";

/**
 * Create a single HTTP server
 * This server will handle:
 * - Express HTTP requests
 * - WebSocket / Socket.IO connections
 */
const server = http.createServer(app);

/**
 * Initialize realtime layer (Socket.IO / WS)
 * Must receive the SAME server instance
 */
initSocketServer(server);

/**
 * Start listening ONCE
 */
server.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});

/**
 * Catch synchronous errors that escape the event loop
 * These are fatal by definition
 */
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });

  // Exit immediately — process state is unreliable
  process.exit(1);
});

/**
 * Catch rejected promises that were never awaited/handled
 * Log them, but do NOT crash the process
 */
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", {
    reason,
  });
});
