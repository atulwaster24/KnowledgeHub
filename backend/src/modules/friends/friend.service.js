import {
  findRequest,
  createRequest,
  updateStatus,
  getIncomingRequests,
  getFriends,
} from "./friend.repository.js";
import prisma from "../../shared/db/prisma.js";

import { AppError } from "../../shared/errors/AppError.js";
import { emitToUser } from "../../realtime/socketServer.js";

export const sendRequest = async (fromId, toId) => {
  if (fromId === toId) {
    throw new AppError("Cannot friend yourself", 400);
  }

  const existing = await findRequest(fromId, toId);
  if (existing) {
    throw new AppError("Friend request already sent", 400);
  }

  const requestCreated = await createRequest(fromId, toId);

  emitToUser(toId, {
    type: "FRIEND_REQUEST_RECEIVED",
    payload: {
      fromUserId: fromId,
    },
  });

  return requestCreated;
};

export const acceptRequest = async (requestId, userId) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.receiverId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return updateStatus(requestId, "ACCEPTED");
};

export const rejectRequest = async (requestId, userId) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.receiverId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return updateStatus(requestId, "REJECTED");
};

export const listIncomingRequests = (userId) => {
  return getIncomingRequests(userId);
};

export const listFriends = async (userId) => {
  const records = await getFriends(userId);

  return records.map((r) =>
    r.requesterId === userId ? r.receiver : r.requester
  );
};
