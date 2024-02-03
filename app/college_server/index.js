import WebSocket, { WebSocketServer } from 'ws';
import fs from 'fs';

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Add the new client to the set
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);

        // Broadcast the message to all connected clients
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // Send the message to the client if it's not the original sender
                // client.send(JSON.stringify({ message: message.toString() }));
                client.send(message.toString());
                // client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the client from the set upon disconnection
        clients.delete(ws);
    });
});