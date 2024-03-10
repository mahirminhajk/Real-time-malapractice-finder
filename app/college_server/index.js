import WebSocket, { WebSocketServer } from 'ws';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

//* express
import express from 'express';
//* db connection
import connectDB from './db/connection.js';

const wss = new WebSocketServer({ port: process.env.WS_PORT });
//*express app
const app = express();

//* routers
import authRouter from './routers/authRouter.js';
import alertRouter from './routers/alertRouter.js';
import Alert from './models/Alert.js';

const clients = new Set();

wss.setMaxListeners(15); // Set the maximum number of listeners to 15

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Add the new client to the set
    clients.add(ws);

    ws.on('message', (message) => {
        // console.log(`Received message => ${message}`);

        // Broadcast the message to all connected clients
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // Send the message to the client if it's not the original sender
                // client.send(JSON.stringify({ message: message.toString() }));
                client.send(message.toString());

                const messageJSON = JSON.parse(message);

                //* if message have a image
                if (messageJSON.image) {
                    const alert = new Alert({
                        image: messageJSON.image,
                    });

                    alert.save()
                        .then((result) => {
                            console.log("image saved!");
                        })
                        .catch((error) => {
                            console.error("error saving image!" + error);
                        });




                }


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

//* mongoose connection lister
mongoose.connection.on('disconnected', () => {
    console.error("mongoDB disconnected!");
});

//* middleware
app.use(express.json({ limit: '10mb' })); // Body parser middle
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
//* helmet
app.use(helmet());
//* cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


//* routes
app.use('/api/auth', authRouter);
app.use('/api/alert', alertRouter);

//* error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(process.env.EX_PORT, () => {
    connectDB(process.env.MONGO_URI);
    console.log('Server started on http://localhost:3000');
});
