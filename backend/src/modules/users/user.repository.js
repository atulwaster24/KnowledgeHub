import prisma from "../../shared/db/prisma.js";

export const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      bio: true,
      createdAt: true,
    },
  });
};

export const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      createdAt: true,
    },
  });
};

export const updateUserProfile = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      bio: true,
    },
  });
};
