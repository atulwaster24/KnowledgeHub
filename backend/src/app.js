import express from 'express';
import { requestLogger } from './shared/middlewares/requestLogger.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { AppError } from './shared/errors/AppError.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get("/error-test", () => {
    throw new AppError("Deliberate Error for testing", 400, false);
});

app.use(errorHandler);

export default app;