import sys
import os

# Ensure the project root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.interview_bot import InterviewBot

if __name__ == "__main__":
    try:
        bot = InterviewBot()
        bot.start()
    except KeyboardInterrupt:
        print("\nInterview interrupted. Exiting.")
    except Exception as e:
        print(f"An error occurred: {e}")
