import {
  findUserById,
  findUserByUsername,
  updateUserProfile,
} from "./user.repository.js";

import { AppError } from "../../shared/errors/AppError.js";

export const getMyProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getPublicProfile = async (username) => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateMyProfile = async (userId, bio) => {
  return updateUserProfile(userId, { bio });
};
