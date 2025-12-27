import winston from 'winston';

import env from './env.js';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({
        stack: true
    }),
    winston.format.json()
);

export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: "/logs/error.log",
            level: "error"
        }),
        new winston.transports.File({
            filename: "logs/app.log"
        })
    ]
});


if (env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    )
}