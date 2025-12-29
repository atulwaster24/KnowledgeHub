import express from "express";
import {requireAuth} from "../../shared/middlewares/requireAuth.js";

import { me, updateMe, publicProfile } from "./user.controller.js";

const router = express.Router();

router.get('/me', requireAuth, me);
router.put("/me", requireAuth, updateMe);
router.get("/:username", publicProfile);

export default router;