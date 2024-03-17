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

        ws.on("error", (error) => {
            console.log("Websocket error (1)!", error);
        });

        ws.onerror = (() => {
            console.log("Websocket error (2)!", error);
        });

    });
}

export function broadcastUpdateNotification(data) {
    try {
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
    catch (error) {
        console.log("Error sending update notification: ", error);
    }
}

export default socketSrv;