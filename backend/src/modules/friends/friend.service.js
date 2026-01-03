import {
  findRequest,
  createRequest,
  updateStatus,
  getIncomingRequests,
  getFriends,
} from "./friend.repository.js";
import prisma from "../../shared/db/prisma.js";

import { AppError } from "../../shared/errors/AppError.js";
import { emitEvent } from "../../events/eventBus.js";
import { EVENTS } from "../../events/eventTypes.js";

export const sendRequest = async (fromId, toId) => {
  if (fromId === toId) {
    throw new AppError("Cannot friend yourself", 400);
  }

  const existing = await findRequest(fromId, toId);
  if (existing) {
    throw new AppError("Friend request already sent", 400);
  }

  const requestCreated = await createRequest(fromId, toId);

  await emitEvent(EVENTS.FRIEND_REQUEST_SENT, { fromId, toId });

  return requestCreated;
};

export const acceptRequest = async (requestId, userId) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.receiverId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const updated = await updateStatus(requestId, "ACCEPTED");

  await emitEvent(EVENTS.FRIEND_REQUEST_ACCEPTED, {
    requesterId: request.requesterId,
    receiverId: request.receiverId
  })

  return updated;
};


export const rejectRequest = async (requestId, userId) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.receiverId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const updated = updateStatus(requestId, "REJECTED");

  await emitEvent(EVENTS.FRIEND_REQUEST_REJECTED, {
    requesterId: request.requesterId,
    receiverId: request.receiverId
  })

  return updated;
};

export const listIncomingRequests = (userId) => {
  return getIncomingRequests(userId);
};

export const listFriends = async (userId) => {
  const friends = await getFriends(userId);

  return friends.map((f) =>
    f.requesterId === userId ? f.receiver : f.requester
  );
};
