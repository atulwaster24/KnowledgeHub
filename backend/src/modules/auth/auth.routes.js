import express from "express";

import { login, logout, me, refresh, register } from "./auth.controller.js";
import { requireAuth } from "../../shared/middlewares/requireAuth.js";

const router = express.Router();

router.post("/register", register);

router.post('/login', login);

router.get("/me", requireAuth, me);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;