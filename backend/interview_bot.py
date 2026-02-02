import asyncio
import os
import sys
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.prompt import Prompt, Confirm

from core.parser import ResumeParser
from core.gemini_client import GeminiClient
from core.schemas import Action, NextStepType
from dotenv import load_dotenv


load_dotenv()
console = Console()

MAX_QUESTIONS = 12
MAX_CONSECUTIVE_WEAK = 3

class InterviewBot:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            console.print("[bold red]Error:[/bold red] GOOGLE_API_KEY not found in environment.")
            sys.exit(1)
        
        self.client = GeminiClient(api_key=self.api_key, model_name="models/gemini-2.0-flash")
        self.history = []
        self.context_summary = ""
        self.poor_answer_streak = 0
        self.questions_asked = 0

    def start(self):
        console.print(Panel.fit("[bold blue]Realtime AI Interviewer[/bold blue]", border_style="blue"))
        
        # 1. Input Phase
        resume_path = Prompt.ask("[bold green]Enter path to Resume (PDF/DOCX)[/bold green]")
        while not os.path.exists(resume_path):
            console.print("[red]File not found. Try again.[/red]")
            resume_path = Prompt.ask("[bold green]Enter path to Resume[/bold green]")
            
        jd_text = Prompt.ask("[bold green]Enter Job Description (or press Enter to paste multiline)[/bold green]")
        if not jd_text:
            console.print("Paste JD below. Press Ctrl+D (Unix) or Ctrl+Z (Win) to finish:")
            jd_text = sys.stdin.read()

        try:
            with console.status("[bold yellow]Scanning Resume...[/bold yellow]"):
                resume_text = ResumeParser.extract_text(resume_path)
            
            with console.status("[bold yellow]Synthesizing Context...[/bold yellow]"):
                self.context_summary = self.client.summarize_context(resume_text, jd_text)
                
            console.print(Panel(Markdown(self.context_summary), title="Context Summary", border_style="green"))
            
        except Exception as e:
            console.print(f"[bold red]Initialization Error:[/bold red] {e}")
            return

        # 2. Loop Phase
        self.interview_loop()

    def interview_loop(self):
        console.print("\n[bold magenta]Starting Interview...[/bold magenta]\n")
        
        # Initial kick-off (empty history) -> Agent starts.
        # But our generate_question expects valid history or handles empty. 
        # Our prompt logic in GeminiClient handles empty history by generating first question.
        
        step_count = 0
        while True:
            step_count += 1
            with console.status("[bold cyan]Interviewer is thinking...[/bold cyan]"):
                try:
                    evaluation = self.client.generate_question(self.history, self.context_summary)
                except Exception as e:
                    console.print(f"[bold red]API Error:[/bold red] {e}")
                    break

            # Display Agent's Move
            decision = evaluation.decision
            next_step = evaluation.next_step
            
            # Show internal thought (Optional, for debug/demo)
            # console.print(f"[dim]Confidence: {evaluation.meta.confidence_level}[/dim]")
            if evaluation.last_answer_evaluation and evaluation.last_answer_evaluation.signal == "weak":
                self.poor_answer_streak += 1
            elif evaluation.last_answer_evaluation: # Reset only if there was an answer evaluation that wasn't weak
                self.poor_answer_streak = 0
            
            if decision.action == Action.END:
                console.print(Panel(f"[bold red]Interview Ended.[/bold red]\nReason: {decision.reason}", border_style="red"))
                break

            # Ask Question
            if next_step.type != NextStepType.NONE:
                question = next_step.question
                console.print(Panel(f"[bold blue]Interviewer:[/bold blue] {question}", border_style="blue"))
                
                # Add Agent Question to History
                self.questions_asked += 1
                self.history.append({"role": "model", "content": question})
                
                # Get User Answer
                # Get User Answer
                console.print("\n[bold green]You (Press Enter twice to finish current answer):[/bold green]")
                user_lines = []
                empty_line_count = 0
                while True:
                    try:
                        line = input()
                        if not line.strip():
                             empty_line_count += 1
                             if empty_line_count >= 2: # Break on 2nd consecutive empty line
                                 break
                        else:
                             # If we had accumulated empty lines (paragraph breaks), add them now
                             if empty_line_count > 0:
                                 for _ in range(empty_line_count):
                                     user_lines.append("") 
                             empty_line_count = 0
                             user_lines.append(line)
                    except EOFError:
                        break
                    except KeyboardInterrupt:
                        return # Exit gracefully
                
                user_answer = "\n".join(user_lines)
                if not user_answer.strip():
                     console.print("[dim]Empty answer... ending interview.[/dim]")
                     break

                self.history.append({"role": "user", "content": user_answer})
            else:
                # Should not happen if action is CONTINUE but next_step is NONE, unless strictly pure evaluation turn.
                # In that case, we might just loop? but usually Model outputs a question.
                # If it's weird, lets break or ask for continuation.
                console.print("[dim]No specific question asked...[/dim]")
                break

        # 3. Feedback Phase
        with console.status("[bold yellow]Generating Final Report...[/bold yellow]"):
            final_report = self.client.generate_feedback(self.history, self.context_summary)
            
        self.display_report(final_report)

    def display_report(self, report):
        console.print("\n")
        console.print(Panel.fit("[bold gold1]Final Evaluation Report[/bold gold1]", border_style="gold1"))
        
        # Summary
        summary_md = f"""
        **Overall Score**: {report.summary.overall_score}/100
        **Recommendation**: {report.summary.hire_recommendation.upper()}
        **Level**: {report.summary.seniority_assessment.upper()}
        """
        console.print(Panel(Markdown(summary_md), title="Summary"))
        
        # Dimensions
        if report.dimension_scores:
            dim = report.dimension_scores
            console.print(f"Tech Depth: {dim.technical_depth} | Prob Solving: {dim.problem_solving} | Comm: {dim.communication}")
        
        # Verdict
        if report.verdict:
            verdict_md = f"""
            **Final Verdict**: {report.verdict.final_recommendation_text}
            
            **Ideally Fix**:
            {chr(10).join(['- ' + x for x in report.verdict.areas_to_fix_before_next_interview])}
            """
            console.print(Panel(Markdown(verdict_md), title="Verdict", border_style="red"))
        else:
            console.print("[dim]Detailed verdict not available.[/dim]")

if __name__ == "__main__":
    bot = InterviewBot()
    bot.start()
