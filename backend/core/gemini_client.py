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

    def summarize_context(self, resume_text: str, jd_text: str) -> str:
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
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    def generate_question(self, history: List[dict], context_summary: str) -> QuestionEvaluation:
        # History format check/conversion if needed. 
        # The new SDK expects 'contents' which can be a list of strings or Content objects.
        # We'll construct a prompt string for simplicity and control, or use chat structure.
        
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
        2.  Decide whether to continue the interview or end it.
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

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": QuestionEvaluation,
            },
        )
        # The new SDK parses it into the Pydantic object automatically if response_schema is passed with the class!
        # Or returns text we can parse. Let's verify return type.
        # If response_schema is a Pydantic model, response.parsed is often populated.
        # However, to be safe and matching user snippet:
        # User snippet: Recipe.model_validate_json(response.text)
        
        return QuestionEvaluation.model_validate_json(response.text)

    def generate_feedback(self, history: List[dict], context_summary: str) -> FinalEvaluation:
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
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": FinalEvaluation,
            },
        )
        return FinalEvaluation.model_validate_json(response.text)
