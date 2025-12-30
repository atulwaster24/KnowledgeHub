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
    const data = await listFriends(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
