// src/shared/db/prisma.js
import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "warn", "error"],
});

export default prisma;
