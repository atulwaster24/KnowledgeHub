import prisma from "../../shared/db/prisma.js";

export const findRequest = (requesterId, receiverId) => {
  return prisma.friendRequest.findUnique({
    where: {
      requesterId_receiverId: {
        requesterId,
        receiverId,
      },
    },
  });
};

export const createRequest = (requesterId, receiverId) => {
  return prisma.friendRequest.create({
    data: {
      requesterId,
      receiverId,
    },
  });
};

export const updateStatus = (id, status) => {
  return prisma.friendRequest.update({
    where: { id },
    data: { status },
  });
};

export const getIncomingRequests = (userId) => {
  return prisma.friendRequest.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      requester: { select: { id: true, username: true } },
    },
  });
};

export const getFriends = (userId) => {
  return prisma.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
    include: {
      requester: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } },
    },
  });
};
