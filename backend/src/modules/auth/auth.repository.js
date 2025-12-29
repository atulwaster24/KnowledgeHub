import prisma from "../../shared/db/prisma.js";

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByUsername = (username) => {
  return prisma.user.findUnique({ where: { username } });
};

export const createUser = (data) => {
  return prisma.user.create({ data });
};

export const createRefreshToken = (data) => {
  return prisma.refreshToken.create({ data });
};

export const findRefreshToken = (token) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

export const revokeRefreshToken = (id) => {
    return prisma.refreshToken.update({
        where: { id },
        data: {revoked: true}
    });
};


export const revokeAllUserTokens = (userId) => {
    return prisma.refreshToken.updateMany({
        where: {userId},
        data: {revoked: true}
    });
};