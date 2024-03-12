import WebSocket, { WebSocketServer } from "ws";

let socketSrv;

export function createSocketServer(appServer) {
    socketSrv = new WebSocketServer({ server: appServer, path: "/updates" });

    // Persistent connection established. 
    socketSrv.on("connection", (ws) => {
        ws.clientId = crypto.randomUUID();
        console.log(`Websocket connection established! (${ws.clientId})`);

        // Connection is closed
        ws.on("close", () => {
            console.log(`Websocket connection closed! (${ws.clientId})`);
        });

        // ws.onerror = () => {
        ws.on("error", (error) => {
            console.log("Websocket error!", error);
        });
    });
}

export function broadcastUpdateNotification(data) {
    if (socketSrv) {
        const jsonData = JSON.stringify(data);
        socketSrv.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(jsonData);
            }
        });
    }
    else {
        console.log("Websocket server not created!");
    }
}

export default socketSrv;