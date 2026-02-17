import asyncio
import os
from google import genai
from google.genai import types
from typing import List, Optional
from .schemas import QuestionEvaluation, FinalEvaluation, MidInterviewSnapshot

class GeminiClient:
    def __init__(self, api_key: str = None, model_name: str = "gemini-2.0-flash"):
        if not api_key:
            api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    async def summarize_context(self, resume_text: str, jd_text: str) -> str:
        prompt = f"""
        You are an expert technical recruiter and interviewer. 
        Analyze the following Resume and Job Description (JD). 
        Create a dense, information-rich summary of under 2000 tokens.
        
        Output in the following sections ONLY:
        Candidate Profile
        Matched Skills
        Missing Skills
        Seniority Estimate
        Key Projects
        Interview Focus Areas

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {jd_text}
        """
        
        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def generate_question(self, history: List[dict], context_summary: str) -> QuestionEvaluation:
        prompt_history = "INTERVIEW HISTORY:\n"
        for turn in history:
            role = turn['role']
            content = turn['content']
            prompt_history += f"{role.upper()}: {content}\n"
            
        prompt = f"""
        You are an expert technical interviewer conducting a realtime interview.
        
        You must internally follow these steps:
        1. Evaluate the candidate’s last answer
        2. Decide whether to continue or end
        3. Decide next question strategy
        4. Generate ONE question

        Do NOT output intermediate reasoning.
        
        CONTEXT SUMMARY:
        {context_summary}
        
        YOUR GOAL:
        1.  Evaluate the candidate's last answer (if any).
        2.  Decide whether to continue or end it.
        3.  Generate the next question if continuing.
        
        RULES:
        -   Start with a greeting and an initial question if the history is empty.
        -   Be professional, encouraging, but rigorous.
        -   Dig deep into technical concepts. Don't accept surface-level answers.
        -   If the candidate struggles, offer a small hint or move to a simpler related topic.
        -   If the candidate answers well, increase difficulty.
        -   Ensure coverage of key skills from the JD.
        
        OUTPUT FORMAT:
        You must return a JSON object strictly adhering to the schema.

        {prompt_history}
        
        Evaluate the last user response (if any) and generate the next step.
        """

        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": QuestionEvaluation,
            },
        )
        return QuestionEvaluation.model_validate_json(response.text)

    async def generate_feedback(self, history: List[dict], context_summary: str) -> FinalEvaluation:
        prompt_history = "INTERVIEW HISTORY:\n"
        for turn in history:
            role = turn['role']
            content = turn['content']
            prompt_history += f"{role.upper()}: {content}\n"

        prompt = f"""
        You are an expert technical interviewer. The interview has ended.
        Provide a comprehensive final evaluation of the candidate.
        
        CONTEXT SUMMARY:
        {context_summary}
        
        {prompt_history}
        
        Generate the final detailed evaluation report.
        """
        
        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": FinalEvaluation,
            },
        )
        return FinalEvaluation.model_validate_json(response.text)

    def connect_live(self, system_instruction: str):
        # Configuration aligning with user snippet where possible, while maintaining our features
        config = {
            "response_modalities": ["AUDIO", "TEXT"],
            "system_instruction": system_instruction,
            # Keeping voice config for now as it's standard for Bidi
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": "Puck"
                    }
                }
            }
        }
        return self.client.aio.live.connect(model=self.model_name, config=config)

    async def generate_chat_stream(self, history: List[dict], context_summary: str):
        """
        Streams regular text response based on history and context.
        Bypasses JSON structure for conversation flow to enable standard streaming.
        """
        # Construct prompt similar to live session but designed for text-only stream
        prompt_history = "INTERVIEW HISTORY:\n"
        for turn in history:
            role = turn['role']
            content = turn['content']
            prompt_history += f"{role.upper()}: {content}\n"
            
        system_instruction = f"""
        You are an expert technical interviewer.
        
        CONTEXT SUMMARY:
        {context_summary}
        
        GOAL:
        Ask questions to evaluate the candidate based on the Job Description.
        One question at a time.
        Be professional but conversational.
        If the candidate answers well, go deeper.
        If they struggle, hint or move on.
        
        Start by introducing yourself and asking the first question if history is empty.
        """
        
        # We append the history to the contents or manage it via chat session.
        # Ideally, we used ephemeral stateless calls before.
        # Let's use generaate_content_stream with the history in the prompt 
        # (or list of content objects if we wanted to be fancy, but text prompt is fine).
        
        full_prompt = f"{system_instruction}\n\n{prompt_history}\n\nCandidate just replied. Respond to the candidate."

        async for chunk in await self.client.aio.models.generate_content_stream(
            model=self.model_name,
            contents=full_prompt,
        ):
            if chunk.text:
                yield chunk.text
