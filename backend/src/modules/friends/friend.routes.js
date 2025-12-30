import express from "express";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";
import { accept, reject, friends, incoming, send } from "./friends.controller.js";

const router = express.Router();

router.post("/request", requireAuth, send);
router.post("/accept/:id", requireAuth, accept)
router.post("/reject/:id", requireAuth, reject)
router.get("/", requireAuth, friends);
router.get("/incoming", requireAuth, incoming);

export default router;