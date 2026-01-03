/**
 * This file contains the event bus for the application.
 * The event bus is responsible for publishing and subscribing to domain events.
 *
 * The event bus is implemented using a Map, where the key is the event type and the value is an array of event handlers.
 */

import { logger } from "../config/logger.js";

/**
 * The handlers map stores the event handlers by event type.
 * The map is initialized with an empty array for each event type when the first event handler is registered.
 */
const handlers = new Map();

/**
 * Registers an event handler for the given event type.
 * If the event type does not exist in the handlers map, an empty array is initialized for the event type.
 * The event handler is then pushed onto the array of event handlers for the given event type.
 *
 * @param {String} eventType The type of event to register the handler for.
 * @param {Function} handler The event handler to register.
 */
export const onEvent = (eventType, handler) => {
    if (!handlers.has(eventType)) {
        handlers.set(eventType, []);
    }

    handlers.get(eventType).push(handler);
}

/**
 * Publishes the given event to all registered event handlers.
 * The event handlers are invoked in the order they were registered.
 * If an event handler throws an error, the error is logged and the event bus continues to invoke the next event handler.
 *
 * @param {String} eventType The type of event to publish.
 * @param {Object} payload The payload of the event to publish.
 */
export const emitEvent = async (eventType, payload) => {
    const eventHandlers = handlers.get(eventType) || [];

    logger.info("Domain event emitted.", { eventType, payload });

    for (const handler of eventHandlers) {
        try {
            await handler(payload);
        } catch (err) {
            logger.error("Domain event handler failed.", { eventType, payload, error: err.message });
        }
    }
}
