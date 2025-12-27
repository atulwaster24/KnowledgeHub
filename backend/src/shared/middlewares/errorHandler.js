import { logger } from "../../config/logger.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    logger.error({
        message:err.message,
        statusCode,
        path:req.originalUrl,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        message: err.isOperational ? err.message : "Internal server error", 
    })
}