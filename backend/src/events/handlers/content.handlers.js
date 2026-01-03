import { onEvent } from "../eventBus.js";
import { EVENTS } from "../eventTypes.js";
import { enqueuePdfProcessing } from "../../jobs/worker.js";
import { emitToUser } from "../../realtime/socketServer.js";

onEvent(EVENTS.DOCUMENT_UPLOADED, async ({ documentId, fileKey, ownerId }) => {
  enqueuePdfProcessing({ documentId, fileKey });

  emitToUser(ownerId, {
    type: "DOCUMENT_UPLOADED",
    payload: { documentId }
  });
});
