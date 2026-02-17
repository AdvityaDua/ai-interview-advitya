import asyncio
import websockets
import json
import base64

async def test_live_interview():
    uri = "ws://localhost:8000/ws/live/test-live-user"
    async with websockets.connect(uri) as websocket:
        print("Connected to Live WebSocket")
        
        # 1. Send Init
        init_payload = {
            "type": "init",
            "resume_text": "Experienced Python Developer.",
            "jd_text": "Looking for Python expert."
        }
        await websocket.send(json.dumps(init_payload))
        print("Sent Init")
        
        # 2. Wait a bit for connection to establish upstream
        # The first message from Gemini might be the intro.
        # We listen for messages.
        
        async def receive_loop():
            try:
                while True:
                    response = await websocket.recv()
                    data = json.loads(response)
                    if data.get("type") == "text":
                        print(f"Gemini (Text): {data.get('content')}")
                    elif data.get("type") == "audio":
                        # print(f"Gemini (Audio): {len(data.get('data'))} bytes")
                        pass # too noisy
            except websockets.exceptions.ConnectionClosed:
                print("Connection Closed")

        # Start receiving in background
        recv_task = asyncio.create_task(receive_loop())
        
        # 3. Send a greeting text
        await asyncio.sleep(2) # Wait for potential intro
        
        text_payload = {
            "type": "text",
            "data": "Hello, I am ready for the interview."
        }
        await websocket.send(json.dumps(text_payload))
        print("Sent Greeting")
        
        await asyncio.sleep(10) # Let conversation happen a bit
        
        recv_task.cancel()

if __name__ == "__main__":
    asyncio.run(test_live_interview())
