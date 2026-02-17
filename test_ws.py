import asyncio
import websockets
import json

async def test_interview():
    uri = "ws://localhost:8000/ws/interview/test-client-1"
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket")
        
        # 1. Send Init
        # Using dummy text for Resume/JD
        init_payload = {
            "type": "init",
            "resume_text": "Experienced Python Developer with 5 years in AWS.",
            "jd_text": "Looking for Python expert for backend role."
        }
        await websocket.send(json.dumps(init_payload))
        print("Sent Init")
        
        # 2. Receive Context Summary
        response = await websocket.recv()
        data = json.loads(response)
        print(f"Received: {data.get('type')}")
        if data.get('type') == 'context_summary':
            print("Context Summary received")
            
        # 3. Receive First Question
        response = await websocket.recv()
        data = json.loads(response)
        print(f"Received: {data.get('type')}")
        if data.get('type') == 'question':
            print(f"Question: {data.get('content')}")
            
        # 4. Send Answer
        answer_payload = {
            "type": "answer",
            "content": "I have used AWS Lambda and DynamoDB for serverless architectures."
        }
        await websocket.send(json.dumps(answer_payload))
        print("Sent Answer")
        
        # 5. Receive Follow-up or End
        response = await websocket.recv()
        data = json.loads(response)
        print(f"Received: {data.get('type')}")
        if data.get('type') == 'question':
             print(f"Follow-up Question: {data.get('content')}")
        elif data.get('type') == 'end':
             print("Interview Ended")

if __name__ == "__main__":
    asyncio.run(test_interview())
