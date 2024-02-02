import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './WebSocketComp.css'

function WebSocketComp() {

    const socketUrl = 'ws://localhost:8080/ws'
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false);


    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        socketUrl,
        {
            share: true,
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        if (lastMessage && lastMessage.data) {
            const parsedData = JSON.parse(lastMessage.data);
            console.log(parsedData);

            if (parsedData.type === 'connection') {
                setConnectionStatus(true);
            } else if (parsedData.type === 'message') {
                const newMessages = [...messages, { content: parsedData.content, timestamp: new Date() }];
                setMessages(newMessages.slice(-8)); // Keep only the last 8 messages
                if (connectionStatus === false) setConnectionStatus(true);
            } else {
                setConnectionStatus(false);
            }
        }
    }, [lastMessage]);

    return (
        <div className='container'>
            <div className='status'>
                <div className={`status-circle ${connectionStatus ? 'status-circle-online' : 'status-circle-offline'}`}></div>
                <div className={`status-text ${connectionStatus ? 'status-text-online' : 'status-text-offline'}`}>{connectionStatus ? 'Online' : 'Offline'}</div>
            </div>
            <ul>
                {messages.slice().reverse().map((msg, index) => (
                    <li key={index} className={index === 0 ? 'highlight' : ''}>
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} : {msg.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WebSocketComp

//* connection path 
{/* <p>WebSocket Status: {ReadyState[readyState]}</p> */ }

//* last message
{/* <div>
                <p>Last Message: {messages.length > 0 ? messages[messages.length - 1].content : ''}</p>
            </div> */}