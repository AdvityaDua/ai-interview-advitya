import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from core.session import InterviewSession
from core.live_session import LiveInterviewSession
from core.gemini_client import GeminiClient
from core.schemas import Action, NextStepType

load_dotenv()

app = FastAPI()

# Store active sessions: client_id -> Session
sessions = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_json(self, websocket: WebSocket, data: dict):
        await websocket.send_json(data)

manager = ConnectionManager()

@app.websocket("/ws/interview/{client_id}")
async def interview_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        client = GeminiClient()
        session = InterviewSession(client)
        sessions[client_id] = session
        
        # 1. Wait for Init Data
        data = await websocket.receive_text()
        init_payload = json.loads(data)
        
        if init_payload.get("type") == "init":
            resume_text = init_payload.get("resume_text", "")
            jd_text = init_payload.get("jd_text", "")
            
            await session.initialize_session(resume_text, jd_text)
            
            await manager.send_json(websocket, {
                "type": "context_summary",
                "content": session.context_summary
            })
            
            # Trigger first turn
            evaluation = await session.process_user_input(None)
            if evaluation.next_step.type != NextStepType.NONE:
                await manager.send_json(websocket, {
                    "type": "question",
                    "content": evaluation.next_step.question,
                    "meta": evaluation.meta.model_dump()
                })
        
        # 2. Main Loop
        while True:
            message_data = await websocket.receive_text()
            message = json.loads(message_data)
            
            if message.get("type") == "answer":
                user_content = message.get("content")
                evaluation = await session.process_user_input(user_content)
                
                if evaluation.decision.action == Action.END:
                    final_report = await session.generate_final_report()
                    await manager.send_json(websocket, {
                        "type": "end",
                        "reason": evaluation.decision.reason,
                        "report": final_report.model_dump()
                    })
                    break
                
                if evaluation.next_step.type != NextStepType.NONE:
                    await manager.send_json(websocket, {
                        "type": "question",
                        "content": evaluation.next_step.question, 
                        "evaluation": evaluation.last_answer_evaluation.model_dump() if evaluation.last_answer_evaluation else None
                    })

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        if client_id in sessions:
            del sessions[client_id]
    except Exception as e:
        print(f"Error in interview_endpoint: {e}")
        try:
            await websocket.close()
        except:
            pass

@app.websocket("/ws/live/{client_id}")
async def live_interview_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        client = GeminiClient()
        session = LiveInterviewSession(client)
        # We might store session if needed, but LiveSession is ephemeral per connection
        
        # Init handshake
        data = await websocket.receive_text()
        init_payload = json.loads(data)
        
        if init_payload.get("type") == "init":
            resume_text = init_payload.get("resume_text", "")
            jd_text = init_payload.get("jd_text", "")
            await session.initialize_session(resume_text, jd_text)
            
            # Start Live Session (This blocks until connection closes)
            await session.start_session(websocket, manager)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error in live_endpoint: {e}")
        try:
            await websocket.close()
        except:
            pass

from core.streaming_session import StreamingInterviewSession

@app.websocket("/ws/stream/{client_id}")
async def stream_interview_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        client = GeminiClient()
        session = StreamingInterviewSession(client)
        
        # 1. Wait for Init Data
        data = await websocket.receive_text()
        init_payload = json.loads(data)
        
        if init_payload.get("type") == "init":
            print(f"Received init payload. Resume length: {len(init_payload.get('resume_text', ''))}")
            resume_text = init_payload.get("resume_text", "")
            jd_text = init_payload.get("jd_text", "")
            
            print("Initializing session...")
            await session.initialize_session(resume_text, jd_text)
            print("Session initialized. Sending context summary info...")
            
            # Send context summary (optional)
            await manager.send_json(websocket, {
                "type": "info",
                "content": "Context initialized."
            })
            
            # Trigger first greeting
            await manager.send_json(websocket, {"type": "stream_start"})
            async for chunk in session.stream_response(None):
                await manager.send_json(websocket, {"type": "text", "content": chunk})
            await manager.send_json(websocket, {"type": "stream_end"})
            
        # 2. Main Loop
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            if payload.get("type") == "message":
                user_text = payload.get("content")
                
                # Stream back response
                await manager.send_json(websocket, {"type": "stream_start"})
                async for chunk in session.stream_response(user_text):
                     await manager.send_json(websocket, {"type": "text", "content": chunk})
                await manager.send_json(websocket, {"type": "stream_end"})
                
                # Check if interview ended
                if session.ended:
                    print("Interview ended. Generating feedback...")
                    await manager.send_json(websocket, {"type": "info", "content": "Interview complete. Generating feedback..."})
                    
                    feedback = await client.generate_feedback(session.history, session.context_summary)
                    
                    await manager.send_json(websocket, {
                        "type": "end_interview",
                        "feedback": feedback.model_dump()
                    })
                    break 

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error in stream_endpoint: {e}")
        try:
            await websocket.close()
        except:
            pass
