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
import { delCache, getCache, setCache } from "../../shared/cache/cache.js";

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

  const updated = await updateStatus(requestId, "ACCEPTED");

  // 🔥 Cache invalidation (critical)
  await Promise.all([
    delCache(`friends:${request.requesterId}`),
    delCache(`friends:${request.receiverId}`)
  ]);

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

  await Promise.all([
    delCache(`friends:${request.requesterId}`),
    delCache(`friends:${request.receiverId}`)
  ])

  return updated;
};

export const listIncomingRequests = (userId) => {
  return getIncomingRequests(userId);
};

export const listFriends = async (userId) => {
  const cacheKey = `friends:${userId}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const friends = await getFriends(userId);
  await setCache(cacheKey, friends, 120);

  return friends.map((f) =>
    f.requesterId === userId ? f.receiver : f.requester
  );
};
