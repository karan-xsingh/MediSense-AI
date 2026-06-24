"""
MediSense AMD — Medicine Reminder System
"""

import os
import json
import threading
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# In-memory reminder store (use SQLite for production)
reminders = {}

def send_whatsapp(phone: str, message: str):
    """Send WhatsApp message via Twilio"""
    try:
        from twilio.rest import Client
        client = Client(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN")
        )
        client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{phone}",
            body=message
        )
        return True
    except Exception as e:
        print(f"WhatsApp error: {e}")
        return False


def reminder_worker(reminder_id: str, phone: str, medicine: str,
                   patient_name: str, reminder_time_str: str, repeat: str):
    """Background worker that sends reminder at scheduled time"""
    
    while True:
        now = datetime.now().strftime("%H:%M")
        
        if now == reminder_time_str:
            message = (
                f"💊 *MediSense AMD Medicine Reminder* 🏥\n\n"
                f"Hello {patient_name}! 👋\n\n"
                f"⏰ Time to take your medicine:\n"
                f"━━━━━━━━━━━━━━━━━━\n"
                f"💊 *{medicine}*\n"
                f"━━━━━━━━━━━━━━━━━━\n\n"
                f"✅ Please take it now and stay healthy!\n\n"
                f"_MediSense AMD AI Healthcare_ 🤖"
            )
            send_whatsapp(phone, message)
            
            if repeat == "once":
                # Remove reminder after sending
                if reminder_id in reminders:
                    del reminders[reminder_id]
                break
            
            # Wait 61 seconds to avoid sending twice in same minute
            time.sleep(61)
        else:
            time.sleep(30)  # Check every 30 seconds


def add_reminder(reminder_id: str, phone: str, medicine: str,
                patient_name: str, reminder_time: str, repeat: str = "daily"):
    """Add a new medicine reminder"""
    
    reminders[reminder_id] = {
        "id": reminder_id,
        "phone": phone,
        "medicine": medicine,
        "patient_name": patient_name,
        "time": reminder_time,
        "repeat": repeat,
        "created_at": datetime.now().isoformat()
    }
    
    # Start background thread
    thread = threading.Thread(
        target=reminder_worker,
        args=(reminder_id, phone, medicine, patient_name, reminder_time, repeat),
        daemon=True
    )
    thread.start()
    
    return reminders[reminder_id]


def get_reminders(phone: str = None):
    """Get all reminders or for specific phone"""
    if phone:
        return [r for r in reminders.values() if r["phone"] == phone]
    return list(reminders.values())


def delete_reminder(reminder_id: str):
    """Delete a reminder"""
    if reminder_id in reminders:
        del reminders[reminder_id]
        return True
    return False