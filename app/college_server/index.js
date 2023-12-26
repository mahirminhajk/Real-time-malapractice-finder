import WebSocket from 'ws';
import express from 'express' // For serving static files

const app = express();
const server = express();
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static('public'));

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Received message:', message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); // Broadcast message to all connected clients
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});