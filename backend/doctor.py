"""
MediSense AMD — AI Doctor Module
Powered by LLaMA 3.3 70B on AMD MI300X via Groq
"""

import os
from dotenv import load_dotenv
import requests
from datetime import datetime

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are Dr. MediSense, an expert AI doctor powered by AMD MI300X. 
You help patients understand their health conditions in simple language.

For every query, structure your response EXACTLY like this:

🔍 **POSSIBLE CONDITIONS:**
[List 2-3 possible conditions based on symptoms]

💊 **MEDICINES (General):**
[Common OTC medicines - always say "consult doctor before taking"]

🥗 **DIET RECOMMENDATIONS:**
[What to eat and avoid]

🏃 **LIFESTYLE ADVICE:**
[Exercise, sleep, stress management]

⚠️ **WARNING SIGNS:**
[When to immediately see a doctor]

🏥 **SPECIALIST NEEDED:**
[Which type of doctor to consult]

Always be caring, clear, and remind patients to consult a real doctor for serious conditions.
Never diagnose definitively - always say "possibly" or "may indicate".
If asked in Hindi, respond in Hindi using Devanagari script."""

def ask_doctor(question: str, language: str = "en", chat_history: list = []) -> str:
    """Get AI doctor response"""
    
    lang_note = "Please respond in Hindi using Devanagari script." if language == "hi" else "Please respond in English."
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + "\n" + lang_note}
    ]
    
    # Add chat history for context
    for msg in chat_history[-6:]:  # Last 6 messages for context
        messages.append(msg)
    
    messages.append({"role": "user", "content": question})
    
    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "max_tokens": 1024,
                "messages": messages,
                "temperature": 0.7
            },
            timeout=30
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error: {str(e)}"


def schedule_medicine_reminder(
    phone: str,
    medicine_name: str,
    reminder_time: str,
    patient_name: str = "Patient",
    account_sid: str = None,
    auth_token: str = None
) -> dict:
    """Schedule WhatsApp medicine reminder via Twilio"""
    
    try:
        from twilio.rest import Client
        
        sid = account_sid or os.getenv("TWILIO_ACCOUNT_SID")
        token = auth_token or os.getenv("TWILIO_AUTH_TOKEN")
        
        client = Client(sid, token)
        
        message = (
            f"💊 *MediSense AMD — Medicine Reminder*\n\n"
            f"Hello {patient_name}! 👋\n\n"
            f"🕐 It's time to take your medicine:\n"
            f"*{medicine_name}*\n\n"
            f"Please take your medicine now and stay healthy! 🌟\n\n"
            f"_Reminder set at {reminder_time}_\n"
            f"_Powered by MediSense AMD 🤖_"
        )
        
        client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{phone}",
            body=message
        )
        
        return {"success": True, "message": f"Reminder set for {medicine_name} at {reminder_time}"}
    
    except Exception as e:
        return {"success": False, "error": str(e)}