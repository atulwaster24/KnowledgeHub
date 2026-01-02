import {
  findUserById,
  findUserByUsername,
  updateUserProfile,
} from "./user.repository.js";

import { AppError } from "../../shared/errors/AppError.js";
import { delCache, getCache, setCache } from "../../shared/cache/cache.js";

export const getMyProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getPublicProfile = async (username) => {
  const cacheKey = `user:public:${username}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const user = await findUserByUsername(username);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await setCache(cacheKey, user, 120);
  return user;
};

export const updateMyProfile = async (userId, bio) => {
  const updatedUser = await updateUserProfile(userId, { bio });
  await delCache(`user:public:${updatedUser.username}`);
  return updatedUser;
};
