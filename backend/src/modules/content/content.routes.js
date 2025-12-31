import express from 'express';
import { requireAuth } from '../../shared/middlewares/requireAuth.js';
import { createCollection, myCollections, addDocument, documents, share, uploadPdf } from './content.controller.js';

const router = express.Router();

router.post("/", requireAuth, createCollection);
router.get("/", requireAuth, myCollections);
router.post("/:id/documents", requireAuth, addDocument);
router.get("/:id/documents", requireAuth, documents);
router.post("/:id/share", requireAuth, share);
router.post("/:id/documents/upload", requireAuth, uploadPdf);

export default router;