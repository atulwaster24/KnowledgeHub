import { logger } from "../../config/logger.js";

export const processPdf = async ({ documentId, fileKey}) => {
    logger.info("Started PDF processing job", { documentId, fileKey });

    // TODO: implement PDF processing
    await new Promise((resolve)=> setTimeout(resolve, 20000));

    logger.info( "Finished PDF processing job", { documentId, fileKey });
}