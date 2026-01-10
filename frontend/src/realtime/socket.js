let socket;

export const connectSocket = (token, onMessage) => {
    socket = new WebSocket(`ws:localhost:5000?token=${token}`);

    socket.onmessage = (event) => {
        onMessage(JSON.parse(event.data))
    }

    socket.onclose = () => {
        console.log("Websocket disconnected")
    }
}

export const disconnectSocket = () => {
    if (socket) socket.close();
}