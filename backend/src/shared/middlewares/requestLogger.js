import { logger } from "../../config/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        logger.info({
            method:req.method,
            path: req.originalUrl,
            status: res.statusCode,
            time: new Date().toISOString(),
            durationMs: Date.now() - start
        })
    })
    next();
}