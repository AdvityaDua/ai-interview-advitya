import asyncio
import os
import sys
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.prompt import Prompt, Confirm

from core.parser import ResumeParser
from core.gemini_client import GeminiClient
from core.session import InterviewSession
from core.schemas import Action, NextStepType
from dotenv import load_dotenv


load_dotenv()
console = Console()

class InterviewBot:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            console.print("[bold red]Error:[/bold red] GOOGLE_API_KEY not found in environment.")
            sys.exit(1)
        
        self.client = GeminiClient(api_key=self.api_key, model_name="models/gemini-2.0-flash")
        self.session = InterviewSession(self.client)

    async def start(self):
        console.print(Panel.fit("[bold blue]Realtime AI Interviewer[/bold blue]", border_style="blue"))
        
        # 1. Input Phase
        resume_path = Prompt.ask("[bold green]Enter path to Resume (PDF/DOCX)[/bold green]")
        while not os.path.exists(resume_path):
            console.print("[red]File not found. Try again.[/red]")
            resume_path = Prompt.ask("[bold green]Enter path to Resume[/bold green]")
            
        jd_text = Prompt.ask("[bold green]Enter Job Description (or press Enter to paste multiline)[/bold green]")
        if not jd_text:
            console.print("Paste JD below. Press Ctrl+D (Unix) or Ctrl+Z (Win) to finish:")
            # sys.stdin.read() is blocking, use run_in_executor or just keep it blocking for input phase which is fine
            jd_text = await asyncio.to_thread(sys.stdin.read)

        try:
            with console.status("[bold yellow]Scanning Resume...[/bold yellow]"):
                resume_text = ResumeParser.extract_text(resume_path)
            
            with console.status("[bold yellow]Synthesizing Context...[/bold yellow]"):
                await self.session.initialize_session(resume_text, jd_text)
                
            console.print(Panel(Markdown(self.session.context_summary), title="Context Summary", border_style="green"))
            
        except Exception as e:
            console.print(f"[bold red]Initialization Error:[/bold red] {e}")
            import traceback
            traceback.print_exc()
            return

        # 2. Loop Phase
        await self.interview_loop()

    async def interview_loop(self):
        console.print("\n[bold magenta]Starting Interview...[/bold magenta]\n")
        
        # Initial kick-off (empty user response) -> Agent starts.
        # We pass None or empty string to indicate "start".
        
        user_response = None
        
        while self.session.is_active:
            with console.status("[bold cyan]Interviewer is thinking...[/bold cyan]"):
                try:
                    evaluation = await self.session.process_user_input(user_response)
                except Exception as e:
                    console.print(f"[bold red]API Error:[/bold red] {e}")
                    import traceback
                    traceback.print_exc()
                    break

            # Display Agent's Move
            decision = evaluation.decision
            next_step = evaluation.next_step
            
            if self.session.poor_answer_streak > 0:
                 # Optional warning or implicit handling
                 pass
            
            if decision.action == Action.END:
                console.print(Panel(f"[bold red]Interview Ended.[/bold red]\nReason: {decision.reason}", border_style="red"))
                break

            # Ask Question
            if next_step.type != NextStepType.NONE:
                question = next_step.question
                console.print(Panel(f"[bold blue]Interviewer:[/bold blue] {question}", border_style="blue"))
                
                # Get User Answer
                console.print("\n[bold green]You (Press Enter twice to finish current answer):[/bold green]")
                user_lines = []
                empty_line_count = 0
                while True:
                    try:
                        # input() is blocking. working around logic to await it is complex in console.
                        # For this console wrapper, blocking input is acceptable as it's the "client".
                        # But strictly, we should use run_in_executor to not block the event loop?
                        # Since this `start` is the only active task, blocking is okay.
                        line = await asyncio.to_thread(input)
                        if not line.strip():
                             empty_line_count += 1
                             if empty_line_count >= 2: # Break on 2nd consecutive empty line
                                 break
                        else:
                             if empty_line_count > 0:
                                 for _ in range(empty_line_count):
                                     user_lines.append("") 
                             empty_line_count = 0
                             user_lines.append(line)
                    except EOFError:
                        break
                    except KeyboardInterrupt:
                        return # Exit gracefully
                
                user_response = "\n".join(user_lines)
                if not user_response.strip():
                     console.print("[dim]Empty answer... ending interview.[/dim]")
                     self.session.is_active = False # Force end
                     break
            else:
                console.print("[dim]No specific question asked...[/dim]")
                break

        # 3. Feedback Phase
        if self.session.history: # Only generate if we actually did something
            with console.status("[bold yellow]Generating Final Report...[/bold yellow]"):
                final_report = await self.session.generate_final_report()
                
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
    asyncio.run(bot.start())
