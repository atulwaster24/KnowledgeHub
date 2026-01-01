import {WebSocketServer} from "ws";
import {verifyAccessToken} from "./socketAuth.js";
import { logger } from "../config/logger.js";

const clients = new Map(); // userId -> ws

export const initSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    try {
      const user = await verifyAccessToken(req);
      clients.set(user.id, ws);

      console.log("clients", clients.keys);

      logger.info(
        { userId: user.id },
        "WebSocket connected"
      );

      ws.on("close", () => {
        clients.delete(user.id);
        logger.info(
          { userId: user.id },
          "WebSocket disconnected"
        );
      });

    } catch {
      ws.close();
    }
  });
};

export const emitToUser = (userId, event) => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(event));
  }
};
