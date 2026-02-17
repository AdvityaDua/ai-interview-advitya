import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def list_models():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key, http_options={'api_version': 'v1alpha'})
    
    # Standard list (async generator)
    print("--- v1alpha Models ---")
    try:
        for model in client.models.list():
             print(f"Model: {model.name}")
    except Exception as e:
        print(f"Error listing: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
