import asyncio
import websockets
import json

async def test_stream():
    uri = "ws://localhost:8000/ws/stream/test-stream-user"
    async with websockets.connect(uri) as websocket:
        print("Connected to Stream WebSocket")
        
        # 1. Init
        await websocket.send(json.dumps({
            "type": "init",
            "resume_text": "Python Dev",
            "jd_text": "Python Job"
        }))
        print("Sent Init")
        
        # 2. Loop to read stream
        while True:
            try:
                response = await websocket.recv()
                data = json.loads(response)
                
                if data["type"] == "text":
                    print(data["content"], end="", flush=True)
                elif data["type"] == "stream_end":
                    print("\n[Stream End]\n")
                    break # Break after first greeting for check, or continue?
                    # Let's break to send a response
                elif data["type"] == "stream_start":
                    print("\n[Stream Start]")
                elif data["type"] == "info":
                    print(f"\n[Info]: {data['content']}")

            except Exception as e:
                print(f"Error/Closed: {e}")
                break
        
        # 3. Send Response
        print("Sending User Response...")
        await websocket.send(json.dumps({
            "type": "message",
            "content": "I have 5 years of Python experience."
        }))
        
        # 4. Read Reply
        while True:
            try:
                response = await websocket.recv()
                data = json.loads(response)
                
                if data["type"] == "text":
                    print(data["content"], end="", flush=True)
                elif data["type"] == "stream_end":
                    print("\n[Stream End]\n")
                    break 
                elif data["type"] == "stream_start":
                    print("\n[Stream Start]")

            except Exception as e:
                print(f"Error/Closed: {e}")
                break

if __name__ == "__main__":
    asyncio.run(test_stream())
