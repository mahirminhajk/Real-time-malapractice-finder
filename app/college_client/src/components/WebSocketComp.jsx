import { useState, useEffect } from 'react';
import WebSocket from 'ws';

function WebSocketComp() {

    const [message, setMessage] = useState('');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000'); // Connect to ws

        ws.onopen = () => {
            console.log('Connected to ws server');
        }

        ws.onmessage = (message) => {
            setMessage(message.data);
        }

        ws.onclose = () => {
            console.log('Disconnected from ws server');
        }

        return () => {
            ws.close(); // Clean on unmount
        }

    }, []);

    return (
        <div>
            <p>Received message: {message}</p>
        </div>
    )
}

export default WebSocketComp