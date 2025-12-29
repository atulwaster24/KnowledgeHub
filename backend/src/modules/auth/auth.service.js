import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

import {
  findUserByEmail,
  findUserByUsername,
  createUser,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} from "./auth.repository.js";

import {
  EmailAlreadyExistsError,
  UsernameAlreadyExistsError,
  InvalidCredentialsError,
} from "./auth.errors.js";

import { logger } from "../../config/logger.js";
import { signAccessToken, signRefreshToken } from "./jwt.utils.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ email, username, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    logger.warn(`Regisration failed: Email ${email} exists`);
    throw new EmailAlreadyExistsError();
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    logger.warn(`Regisration failed: Username ${username}  exists`);
    throw new UsernameAlreadyExistsError();
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({ email, username, password: hashedPassword });

  logger.info({ userId: user.id }, "User registered successfully");
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.warn(`Login failed: User with email ${email} not found`);
    throw new InvalidCredentialsError();
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    logger.warn(`Login failed: Invalid password for user with email ${email}`);
    throw new InvalidCredentialsError();
  }

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
  });

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  logger.info(`Login successful for user with email ${email}`);

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshSession = async (token) => {
  const storedToken = await findRefreshToken(token);

  if (!storedToken || storedToken.revoked) {
    logger.warn("Refresh attempt with invalid token");
    throw new InvalidCredentialsError();
  }

  let payload;

  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    logger.warn("Refresh token verification failed.");
    throw new InvalidCredentialsError();
  }

  await revokeRefreshToken(storedToken.id);

  const newAccessToken = signAccessToken({
    sub: payload.sub,
  });

  const newRefreshToken = signRefreshToken({
    sub: payload.sub,
  });

  await createRefreshToken({
    token: newAccessToken,
    userId: payload.sub,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  logger.info("Refresh token for user with id " + payload.sub + " rotated.");

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId) => {
  await revokeAllUserTokens(userId);
  logger.info("User with id " + userId + " logged out.");
};
