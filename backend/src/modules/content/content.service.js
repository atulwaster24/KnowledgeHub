import {
  createCollection,
  getUserCollections,
  getCollectionById,
  addDocument,
  listDocuments,
  upsertShare,
  createDocument,
  getDocumentWithCollection,
} from "./content.repository.js";

import { logger } from "../../config/logger.js";
import { AppError } from "../../shared/errors/AppError.js";
import { supabase } from "../../shared/storage/supabase.js";
import { enqueuePdfProcessing } from "../../jobs/worker.js";

const hasAccess = (collection, userId) => {
  if (collection.ownerId === userId) return "OWNER";

  const share = collection.shares.find((s) => s.userId === userId);
  return share ? share.access : null;
};

export const createMyCollection = (userId, data) => {
  return createCollection(userId, data);
};

export const listMyCollections = (userId) => {
  return getUserCollections(userId);
};

export const addDocToCollection = async (collectionId, userId, data) => {
  const collection = await getCollectionById(collectionId);
  if (!collection) throw new AppError("Collection not found", 404);

  const access = hasAccess(collection, userId);

  if (!access || access === "READ") {
    throw new AppError("Forbidden", 403);
  }

  return addDocument(collectionId, data);
};

export const viewDocuments = async (collectionId, userId) => {
  const collection = await getCollectionById(collectionId);
  if (!collection) throw new AppError("Collection not found", 404);

  const access = hasAccess(collection, userId);
  if (!access) throw new AppError("Forbidden", 403);

  return listDocuments(collectionId);
};

export const shareWithFriend = async (
  collectionId,
  ownerId,
  userId,
  access
) => {
  const collection = await getCollectionById(collectionId);
  if (!collection || collection.ownerId !== ownerId) {
    throw new AppError("Forbidden", 403);
  }
  return upsertShare(collectionId, userId, access);
};

export const uploadDocument = async (
  collectionId,
  userId,
  { title, description, fileKey }
) => {
  const collection = await getCollectionById(collectionId);
  if (!collection) throw new AppError("Collection not found", 404);

  const isOwner = collection.ownerId === userId;

  const share = collection.shares.find((s) => s.userId === userId);

  if (!isOwner && share?.access !== "WRITE") {
    throw new AppError("Forbidden", 403);
  }

  const doc = await createDocument(collectionId, {
    title,
    description,
    fileKey,
  });

  enqueuePdfProcessing({
    documentId: doc.id,
    fileKey: doc.fileKey
  })

  return doc;
};

const SIGNED_URL_TTL = 60 * 5;

export const getSignedDocumentUrl = async (documentId, userId) => {
  const doc = await getDocumentWithCollection(documentId);

  if (!doc) throw new AppError("Document not found", 404);

  const { collection } = doc;

  const isOwner = collection.ownerId === userId;
  const share = collection.shares.find((s) => s.userId === userId);

  if (!isOwner && share?.access !== "READ")
    throw new AppError("Forbidden", 403);

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUrl(doc.fileKey, SIGNED_URL_TTL);

  if (error) {
    logger.error(
      "Signed URL generation error for document: ",
      error
    )
    throw new AppError(
      "Failed to generate download link, please try again",
      500
    );
  }

  return {
    url: data.signedUrl,
    expiresIn: SIGNED_URL_TTL,
  };
};
