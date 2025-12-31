import { config } from 'dotenv';

config();

export const env = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT || 5000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    SUPABASE_BUCKET: process.env.SUPABASE_BUCKET
}