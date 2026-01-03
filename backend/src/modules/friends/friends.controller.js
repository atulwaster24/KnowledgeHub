import { getCache, setCache } from "../../shared/cache/cache.js";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  listFriends,
  listIncomingRequests,
} from "./friend.service.js";

export const send = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await sendRequest(req.user.id, userId);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const accept = async (req, res, next) => {
  try {
    const result = await acceptRequest(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const reject = async (req, res, next) => {
  try {
    const result = await rejectRequest(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const incoming = async (req, res, next) => {
  try {
    const data = await listIncomingRequests(req.user.id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const friends = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cacheKey = `friends:${userId}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const friends = await listFriends(userId);

    await setCache(cacheKey, friends, 120);
    res.json(friends);
  } catch (error) {
    next(error);
  }
};
