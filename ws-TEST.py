import websocket
import json
import time
import random

# Connect to the WebSocket server
ws = websocket.WebSocket()
ws.connect("ws://localhost:8080/ws")



def send_message_to_websocket(message):
    ws.send(json.dumps(message))

def send_disconnect_message():
    message = {
        "type": "disconnect",
    }
    send_message_to_websocket(message)

# as a connection is established, send a message to the server
message = {
    "type": "connection",
}

send_message_to_websocket(message)


try:
    while True:
        # wait 5 seconds
        time.sleep(5)
        # send a message
        # get a random number
        x = random.randint(1, 100)
        message = {
            "type": "message",
            "content": f"Hello, I am a message from the client. The random number is {x}"
        }
        send_message_to_websocket(message)
        print("sent message")

except KeyboardInterrupt:
    # Handle Ctrl+C, send disconnect message before exiting
    send_disconnect_message()
    print("Disconnected due to KeyboardInterrupt")

finally:
    # Close the WebSocket connection
    ws.close()
    print("WebSocket connection closed")