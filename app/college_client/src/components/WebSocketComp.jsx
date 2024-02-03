import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './WebSocketComp.css'

//* audio
import alert2 from '../audio/alert2.mp3'

//* icons
import { IoVolumeMute } from "react-icons/io5";
import { IoVolumeHigh } from "react-icons/io5";
import { MdImageNotSupported } from "react-icons/md"
import { MdImage } from "react-icons/md";

function WebSocketComp() {

    const socketUrl = 'ws://localhost:8080/ws'
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isImageShown, setIsImageShown] = useState(true);
    const [imageData, setImageData] = useState(null);
    const [audio, setAudio] = useState(null);


    const { lastMessage } = useWebSocket(
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

                //* image
                if (parsedData.image) {
                    setImageData(`data:image/png;base64,${parsedData.image}`);
                }

                if (connectionStatus === false) setConnectionStatus(true);
                if (!isMuted && (!audio || audio.ended)) {
                    const alertAudio = new Audio(alert2);
                    setAudio(alertAudio);
                    alertAudio.play();
                }
            } else {
                setConnectionStatus(false);
            }
        }
    }, [lastMessage]);

    return (
        <div className='container'>
            <div className='heading'>
                <h2>SecureExam</h2>
                <p>Real-time Malpractice Detection System</p>
            </div>

            <div className='mute'>
                {isImageShown ? <MdImage size='2em' onClick={() => setIsImageShown(false)} /> : <MdImageNotSupported size='2em' onClick={() => setIsImageShown(true)} />}

                {isMuted ? <IoVolumeMute size='2em' onClick={() => setIsMuted(false)} /> : <IoVolumeHigh size='2em' onClick={() => setIsMuted(true)} />}

            </div>
            <div className='status'>
                <div className={`status-circle ${connectionStatus ? 'status-circle-online' : 'status-circle-offline'}`}></div>
                <div className={`status-text ${connectionStatus ? 'status-text-online' : 'status-text-offline'}`}>{connectionStatus ? 'Online' : 'Offline'}</div>
            </div>
            {/* Display image if available */}
            {isImageShown ? <div className='img-and-list'>
                {imageData && <img src={imageData} alt="Person detected" width="300px" />}
                <ul>
                    {messages.slice().reverse().map((msg, index) => (
                        <li key={index} className={index === 0 ? 'highlight' : ''}>
                            {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} : {msg.content}
                        </li>
                    ))}
                </ul>
            </div> :
                <ul>
                    {messages.slice().reverse().map((msg, index) => (
                        <li key={index} className={index === 0 ? 'highlight' : ''}>
                            {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} : {msg.content}
                        </li>
                    ))}
                </ul>}

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