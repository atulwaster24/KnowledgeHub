import prisma from "../../shared/db/prisma.js";

export const createCollection = (ownerId, data) => {
  return prisma.collection.create({
    data: { ...data, ownerId },
  });
};

export const getUserCollections = (userId) => {
  return prisma.collection.findMany({
    where: { ownerId: userId },
  });
};

export const getCollectionById = (id) => {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true } },
      shares: true,
    },
  });
};

export const addDocument = (collectionId, data) => {
  return prisma.document.create({
    data: { ...data, collectionId },
  });
};

export const listDocuments = (collectionId) => {
  return prisma.document.findMany({
    where: { collectionId },
  });
};

export const upsertShare = (collectionId, userId, access) => {
  return prisma.collectionShare.upsert({
    where: {
      collectionId_userId: {
        collectionId,
        userId,
      },
    },
    update: {
      access,
    },
    create: {
      collectionId,
      userId,
      access,
    },
  });
};

export const createDocument = (collectionId, data) => {
  return prisma.document.create({
    data: { ...data, collectionId },
  });
};
