import { redis } from "./redis.js";
export const getCache = async (key) => {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCache = async (key, value, ttl = 60) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const delCache = async (key) => {
  await redis.del(key);
};
