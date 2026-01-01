import { enqueueJob } from "./queue.js";
import { processPdf } from "./handlers/processPdf.js";

export const enqueuePdfProcessing = (payload) => {
  enqueueJob({
    type: "PROCESS_PDF",
    handler: processPdf,
    payload,
  });
};
