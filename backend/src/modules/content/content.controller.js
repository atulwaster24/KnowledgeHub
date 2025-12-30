import {
  createMyCollection,
  listMyCollections,
  addDocToCollection,
  viewDocuments,
  shareWithFriend,
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
