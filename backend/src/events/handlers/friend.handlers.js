import { onEvent } from "../eventBus.js";
import { EVENTS } from "../eventTypes.js";
import { delCache } from "../../shared/cache/cache.js";
import { emitToUser } from "../../realtime/socketServer.js";

onEvent(EVENTS.FRIEND_REQUEST_ACCEPTED, async ({requesterId, receiverId}) => {
    await Promise.all([

        //cache invalidation
        delCache('friends:' + requesterId),
        delCache('friends:' + receiverId),
    ]);

    //realtime notification
    emitToUser(requesterId, {
        type: "FRIEND_REQUEST_ACCEPTED",
        payload: { userId: receiverId }
    })

    emitToUser(receiverId, {
        type: "FRIEND_REQUEST_ACCEPTED",
        payload: { userId: requesterId }
    })
})

onEvent(EVENTS.FRIEND_REQUEST_REJECTED, async ({requesterId, receiverId}) => {
    await Promise.all([ 
        delCache('friends:' + requesterId),
        delCache('friends:' + receiverId),
    ]);
})


onEvent(EVENTS.FRIEND_REQUEST_SENT, async ({fromId, toId}) => {
    await Promise.all([

        //cache invalidation
        delCache('friends:' + fromId),
        delCache('friends:' + toId),
    ])

    //realtime notification
    emitToUser(toId, {
        type: "FRIEND_REQUEST_RECEIVED",
        payload: { userId: fromId }
    })
})