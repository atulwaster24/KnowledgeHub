import { logger } from "../config/logger.js";

const queue = [];

let processing = false;

export const enqueueJob = (job) => {
  queue.push({
    ...job,
    attempts: 0,
    createAt: new Date(),
  });

  logger.info("Job enqueued", {
    type: job.type,
    payload: job.payload,
  });

  processQueue();
};

const processQueue = async () => {
    if (processing) return;
    processing = true;

    while (queue.length) {
        const job = queue.shift();
        try {
            await job.handler(job.payload);
            logger.info("Job completed", { type: job.type});
        } catch (err) {
            job.attempts++;


           logger.error({
               message: "Job failed",
               type: job.type,
               appempts: job.attempts,
               error: err,
           })

           if (job.appempts < 3) {
            queue.push(job);
           } else {
            logger.error({
                message: "Job failed after all attempts",
                type: job.type,
                error: err,
            })
           }
        }
    }

    processing = false;
}
