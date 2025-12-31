import { AppError } from "../../shared/errors/AppError.js";
import { streamPdfUpload } from "../../shared/utils/streamUpload.js";
import {
  createMyCollection,
  listMyCollections,
  addDocToCollection,
  viewDocuments,
  shareWithFriend,
  uploadDocument,
  getSignedDocumentUrl,
} from "./content.service.js";

export const createCollection = async (req, res, next) => {
  try {
    const data = await createMyCollection(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const myCollections = async (req, res, next) => {
  try {
    const data = await listMyCollections(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addDocument = async (req, res, next) => {
  try {
    const data = await addDocToCollection(req.params.id, req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const documents = async (req, res, next) => {
  try {
    const data = await viewDocuments(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const share = async (req, res, next) => {
  try {
    const { userId, access } = req.body;
    const data = await shareWithFriend(
      req.params.id,
      req.user.id,
      userId,
      access
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const uploadPdf = async (req, res, next) => {
  try {
    const result = await streamPdfUpload(req);

    if (!result || !result.fileKey)
      throw new AppError("File upload failed", 500);

    const { fileKey, fields } = result;

    const { title, description } = fields;

    if (!title) throw new AppError("Title is required", 400);

    const doc = await uploadDocument(req.params.id, req.user.id, {
      title,
      description,
      fileKey,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const result = await getSignedDocumentUrl(req.params.id, req.user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
