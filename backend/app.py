import os
import sqlite3
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import joblib
from PIL import Image
import io
import base64
import warnings
from groq import Groq
from twilio.twiml.messaging_response import MessagingResponse
warnings.filterwarnings('ignore')

load_dotenv()

app = Flask(__name__)
CORS(app)

# Groq Client
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
groq_client = Groq(api_key=GROQ_API_KEY)

# ===== SQLite Database =====
def init_db():
    conn = sqlite3.connect('medisense.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS predictions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  type TEXT,
                  result TEXT,
                  confidence REAL,
                  prediction INTEGER,
                  timestamp TEXT)''')
    conn.commit()
    conn.close()

def save_to_db(pred_type, result, confidence, prediction):
    try:
        conn = sqlite3.connect('medisense.db')
        c = conn.cursor()
        c.execute("INSERT INTO predictions VALUES (NULL,?,?,?,?,?)",
                  (pred_type, result, confidence, prediction,
                   datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB error: {e}")

def load_from_db():
    try:
        conn = sqlite3.connect('medisense.db')
        c = conn.cursor()
        c.execute("SELECT type, result, confidence, prediction, timestamp FROM predictions ORDER BY id DESC LIMIT 50")
        rows = c.fetchall()
        conn.close()
        return [{"type": r[0], "result": r[1], "confidence": r[2], "prediction": r[3], "timestamp": r[4]} for r in rows]
    except Exception as e:
        print(f"DB error: {e}")
        return []

# Initialize DB
init_db()

# Load models
print("Loading models...")
try:
    diabetes_model = joblib.load('models/diabetes_model.pkl')
    print("✅ Diabetes model loaded!")
except Exception as e:
    print(f"❌ Diabetes: {e}")
    diabetes_model = None

try:
    heart_model = joblib.load('models/heart_model.pkl')
    print("✅ Heart model loaded!")
except Exception as e:
    print(f"❌ Heart: {e}")
    heart_model = None

try:
    kidney_model = joblib.load('models/kidney_model.pkl')
    print("✅ Kidney model loaded!")
except Exception as e:
    print(f"❌ Kidney: {e}")
    kidney_model = None

xray_model = None
print("⚠️ X-Ray model skipped on server")
print("✅ All available models loaded!")

# Home route
@app.route('/')
def home():
    return jsonify({
        "message": "MediSense AI Backend Running!",
        "status": "success",
        "version": "2.0",
        "models": {
            "diabetes": diabetes_model is not None,
            "heart": heart_model is not None,
            "kidney": kidney_model is not None,
            "xray": xray_model is not None
        }
    })

# History routes
@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(load_from_db())

@app.route('/history/add', methods=['POST'])
def add_history():
    data = request.json
    save_to_db(
        data.get('type', ''),
        data.get('result', ''),
        data.get('confidence', 0),
        data.get('prediction', 0)
    )
    return jsonify({"status": "saved"})

# Diabetes prediction
@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    if diabetes_model is None:
        return jsonify({"error": "Model not available"}), 500
    data = request.json
    features = np.array([[
        data['pregnancies'], data['glucose'],
        data['bloodpressure'], data['skinthickness'],
        data['insulin'], data['bmi'],
        data['dpf'], data['age']
    ]])
    prediction = diabetes_model.predict(features)[0]
    probability = diabetes_model.predict_proba(features)[0]
    result = {
        "type": "Diabetes",
        "prediction": int(prediction),
        "result": "Diabetic" if prediction == 1 else "Not Diabetic",
        "confidence": round(float(max(probability)) * 100, 2)
    }
    save_to_db(result['type'], result['result'], result['confidence'], result['prediction'])
    return jsonify(result)

# Heart disease prediction
@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    if heart_model is None:
        return jsonify({"error": "Model not available"}), 500
    data = request.json
    features = np.array([[
        data['age'], data['sex'], data['cp'],
        data['trestbps'], data['chol'], data['fbs'],
        data['restecg'], data['thalach'], data['exang'],
        data['oldpeak'], data['slope'], data['ca'], data['thal']
    ]])
    prediction = heart_model.predict(features)[0]
    probability = heart_model.predict_proba(features)[0]
    result = {
        "type": "Heart Disease",
        "prediction": int(prediction),
        "result": "Heart Disease Detected" if prediction == 1 else "No Heart Disease",
        "confidence": round(float(max(probability)) * 100, 2)
    }
    save_to_db(result['type'], result['result'], result['confidence'], result['prediction'])
    return jsonify(result)

# Kidney disease prediction
@app.route('/predict/kidney', methods=['POST'])
def predict_kidney():
    if kidney_model is None:
        return jsonify({"error": "Model not available"}), 500
    data = request.json
    features = np.array([[
        data['age'], data['bp'], data['sg'],
        data['al'], data['su'], data['rbc'],
        data['pc'], data['pcc'], data['ba'],
        data['bgr'], data['bu'], data['sc'],
        data['sod'], data['pot'], data['hemo'],
        data['pcv'], data['wc'], data['rc'],
        data['htn'], data['dm'], data['cad'],
        data['appet'], data['pe'], data['ane']
    ]])
    prediction = kidney_model.predict(features)[0]
    probability = kidney_model.predict_proba(features)[0]
    result = {
        "type": "Kidney Disease",
        "prediction": int(prediction),
        "result": "Kidney Disease Detected" if prediction == 1 else "No Kidney Disease",
        "confidence": round(float(max(probability)) * 100, 2)
    }
    save_to_db(result['type'], result['result'], result['confidence'], result['prediction'])
    return jsonify(result)

# X-Ray prediction
@app.route('/predict/xray', methods=['POST'])
def predict_xray():
    if xray_model is None:
        return jsonify({
            "type": "X-Ray",
            "result": "X-Ray analysis available on local version only",
            "confidence": 0,
            "prediction": 0
        })
    data = request.json
    image_data = base64.b64decode(data['image'])
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    image = image.resize((150, 150))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    prediction = xray_model.predict(image_array)[0][0]
    result_text = "Pneumonia Detected" if prediction > 0.5 else "Normal"
    confidence = round(float(prediction) * 100 if prediction > 0.5 else (1 - float(prediction)) * 100, 2)
    result = {
        "type": "X-Ray",
        "prediction": float(prediction),
        "result": result_text,
        "confidence": confidence
    }
    save_to_db(result['type'], result['result'], result['confidence'], int(prediction > 0.5))
    return jsonify(result)

# Test Groq
@app.route('/test-groq')
def test_groq():
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "say hello"}],
            max_tokens=50
        )
        return jsonify({"status": "working", "reply": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# Chat route
@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """You are MediBot, a helpful healthcare AI assistant
                    inside MediSense AI platform. You help users understand:
                    - Disease symptoms and prevention
                    - How to interpret their prediction results
                    - General health advice and tips
                    - When to see a doctor
                    Keep responses short, friendly and easy to understand.
                    Always remind users to consult a real doctor for medical decisions.
                    Never diagnose diseases directly."""
                },
                {"role": "user", "content": user_message}
            ],
            max_tokens=500
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Groq error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"}), 500

# WhatsApp Bot
@app.route('/whatsapp', methods=['POST'])
def whatsapp():
    incoming_msg = request.values.get('Body', '').strip()
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """You are MediBot, a healthcare AI assistant for MediSense AI India.
                    Help users understand disease symptoms, prevention and health advice.
                    Keep responses SHORT under 200 words as this is WhatsApp.
                    If user writes in Hindi, respond in Hindi.
                    If user writes in English, respond in English.
                    Always recommend consulting a real doctor.
                    End every message with: Visit medisense-india.vercel.app for AI predictions!"""
                },
                {"role": "user", "content": incoming_msg}
            ],
            max_tokens=300
        )
        reply = completion.choices[0].message.content
    except Exception as e:
        reply = "Sorry, I am having trouble. Please try again!"

    resp = MessagingResponse()
    resp.message(f"🏥 *MediBot*:\n\n{reply}")
    return str(resp)

# ── AI Doctor endpoint ────────────────────────────────────────────────────────
@app.route('/doctor/chat', methods=['POST'])
def doctor_chat():
    data = request.get_json()
    question = data.get('question', '')
    language = data.get('language', 'en')
    chat_history = data.get('chat_history', [])
    
    lang_note = "Respond in Hindi using Devanagari script." if language == "hi" else "Respond in English."
    
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    messages = [{
        "role": "system",
        "content": f"""You are Dr. MediSense AI, an expert doctor. {lang_note}
        
For every query respond with:
🔍 **POSSIBLE CONDITIONS:** [2-3 conditions]
💊 **MEDICINES:** [Common medicines - say consult doctor first]
🥗 **DIET:** [What to eat/avoid]
⚠️ **WARNING SIGNS:** [When to see doctor immediately]
🏥 **SPECIALIST:** [Which doctor to see]"""
    }]
    
    for msg in chat_history[-6:]:
        messages.append(msg)
    messages.append({"role": "user", "content": question})
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1024
        )
        return jsonify({
            "response": response.choices[0].message.content,
            "powered_by": "LLaMA 3.3 70B on AMD MI300X via Groq"
        })
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500


# ── Medicine Reminder endpoint ─────────────────────────────────────────────────
@app.route('/reminders/add', methods=['POST'])
def add_reminder():
    data = request.get_json()
    phone = data.get('phone')
    medicine = data.get('medicine')
    patient_name = data.get('patient_name', 'Patient')
    reminder_time = data.get('reminder_time')

    # Validate inputs
    if not phone or not medicine:
        return jsonify({"success": False, "error": "Phone and medicine required"}), 400

    # Clean phone number
    phone = phone.strip()
    if not phone.startswith('+'):
        phone = '+91' + phone  # Add India code if missing

    try:
        from twilio.rest import Client
        client = Client(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN")
        )

        message = (
            f"💊 *MediSense AI Medicine Reminder*\n\n"
            f"Hello {patient_name}! 👋\n\n"
            f"⏰ Reminder set for: *{reminder_time}*\n"
            f"💊 Medicine: *{medicine}*\n\n"
            f"We'll remind you to take your medicine on time!\n"
            f"Stay healthy! 🌟\n\n"
            f"_MediSense AI — medisense-india.vercel.app_ 🤖"
        )

        client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{phone}",
            body=message
        )

        reminder_id = str(datetime.now().timestamp())[:8]
        return jsonify({
            "success": True,
            "reminder": {
                "id": reminder_id,
                "phone": phone,
                "medicine": medicine,
                "patient_name": patient_name,
                "time": reminder_time
            }
        })
    except Exception as e:
        print(f"Reminder error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)