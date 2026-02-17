import asyncio
import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Config - Using standard flash model
MODEL = "gemini-2.0-flash"
API_KEY = os.getenv("GOOGLE_API_KEY")

# Large Mock Context
RESUME_TEXT = """
Jane Doe
Senior Python Developer
Summary: 10 years of experience in building scalable backend systems.
Skills: Python, Django, FastAPI, Kubernetes, AWS, Gemini API, WebSocket.
Experience:
- Lead Developer at TechCorp (2020-Present): Migrated monolith to microservices. Reduced latency by 40%.
- Senior Eng at StartupX (2015-2020): Built realtime chat application using WebSockets and Redis.
Education: BS CS, MIT.
""" * 5

JD_TEXT = """
Job Title: Staff Software Engineer
Responsibilities:
- Design and implement low-latency systems.
- Mentor junior engineers.
- Integrate GenAI models into production.
Requirements:
- Expert in Python and AsyncIO.
- Experience with LLMs and RAG.
- Strong system design skills.
""" * 5

CONTEXT_SUMMARY = f"Resume:\n{RESUME_TEXT}\n\nJob Description:\n{JD_TEXT}"

SYSTEM_INSTRUCTION = f"""
You are an expert technical interviewer conducting a realtime voice interview.

CONTEXT:
{CONTEXT_SUMMARY}

GOAL:
Ask questions to evaluate the candidate based on the Job Description.
One question at a time.
Be professional but conversational.
Start by introducing yourself and asking the first question.
"""

async def main():
    client = genai.Client(api_key=API_KEY)
    
    print(f"Generating content stream with {MODEL}...")
    
    prompt = "I am ready to begin the interview. Please start."
    
    print("--- Receiving Stream ---")
    start_send = time.time()
    first_token_time = None
    full_response = ""
    
    async for chunk in await client.aio.models.generate_content_stream(
        model=MODEL,
        contents=prompt,
        config={
            "system_instruction": SYSTEM_INSTRUCTION,
        },
    ):
        current_time = time.time()
        
        if chunk.text:
            text = chunk.text
            if not first_token_time:
                first_token_time = current_time - start_send
                print(f"\n[TTFT] Time to First Token: {first_token_time:.4f}s\n")
            
            print(text, end="", flush=True)
            full_response += text

    total_time = time.time() - start_send
    print(f"\n\n--- Stats ---")
    print(f"Total Latency: {total_time:.4f}s")
    print(f"Time to First Token: {first_token_time:.4f}s" if first_token_time else "Time to First Token: N/A")
    print(f"Response Length: {len(full_response)} chars")
    if full_response:
        print(f"Tokens/Sec (approx chars/4): {(len(full_response)/4) / (total_time - (first_token_time or 0)):.2f}")

if __name__ == "__main__":
    asyncio.run(main())
