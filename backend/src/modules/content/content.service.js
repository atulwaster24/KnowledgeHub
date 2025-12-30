import { createCollection, getUserCollections, getCollectionById, addDocument, listDocuments, upsertShare} from "./content.repository.js";

import {AppError} from "../../shared/errors/AppError.js";

const hasAccess = (collection, userId) => {
    if (collection.ownerId === userId) return "OWNER";

    const share = collection.shares.find((s) => s.userId === userId);
    return share? share.access : null;
}

export const createMyCollection = (userId, data) => {
    return createCollection(userId, data);
}

export const listMyCollections = (userId) => {
    return getUserCollections(userId);
}

export const addDocToCollection = async (collectionId, userId, data) => {
    const collection = await getCollectionById(collectionId);
    if(!collection) throw new AppError("Collection not found", 404);

    const access = hasAccess(collection,userId);

    if(!access || access === "READ") {
        throw new AppError("Forbidden", 403);
    }

    return addDocument(collectionId, data);

}

export const viewDocuments = async (collectionId, userId) => {
    const collection = await getCollectionById(collectionId);
    if(!collection) throw new AppError("Collection not found", 404);

    const access = hasAccess(collection,userId);
    if(!access) throw new AppError("Forbidden", 403);

    return listDocuments(collectionId);
}

export const shareWithFriend = async (collectionId, ownerId, userId, access) => {
    const collection = await getCollectionById(collectionId);
    if(!collection || collection.ownerId !== ownerId) {
        throw new AppError("Forbidden", 403);
    }
    return upsertShare(collectionId, userId, access);
}