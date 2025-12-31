import express from 'express';
import { requireAuth } from '../../shared/middlewares/requireAuth.js';
import { createCollection, myCollections, addDocument, documents, share, uploadPdf, downloadDocument } from './content.controller.js';
import { validate } from '../../shared/middlewares/validate.js';
import { createCollectionSchema } from './content.schema.js';

const router = express.Router();

router.post("/", requireAuth, validate(createCollectionSchema), createCollection);
router.get("/", requireAuth, myCollections);
router.post("/:id/documents", requireAuth, addDocument);
router.get("/:id/documents", requireAuth, documents);
router.post("/:id/share", requireAuth, share);
router.post("/:id/documents/upload", requireAuth, uploadPdf);
router.get("/documents/:id/download", requireAuth, downloadDocument);

export default router;