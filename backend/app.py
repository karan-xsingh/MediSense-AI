import os
import sys

os.chdir('/home/Karan18singh/MediSense-AI')

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import joblib
from PIL import Image
import io
import base64
import warnings
from groq import Groq
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Groq Client
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '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')
groq_client = Groq(api_key=GROQ_API_KEY)

prediction_history = []

# Load models
print("Loading models...")
try:
    diabetes_model = joblib.load('models/diabetes_model.pkl')
    print("✅ Diabetes model loaded!")
except Exception as e:
    print(f"❌ Diabetes model error: {e}")
    diabetes_model = None

try:
    heart_model = joblib.load('models/heart_model.pkl')
    print("✅ Heart model loaded!")
except Exception as e:
    print(f"❌ Heart model error: {e}")
    heart_model = None

try:
    kidney_model = joblib.load('models/kidney_model.pkl')
    print("✅ Kidney model loaded!")
except Exception as e:
    print(f"❌ Kidney model error: {e}")
    kidney_model = None

xray_model = None
print("⚠️ X-Ray model skipped (TensorFlow not available)")
print("✅ All available models loaded!")

@app.route('/')
def home():
    return jsonify({
        "message": "MediSense AI Backend Running!",
        "status": "success",
        "models": {
            "diabetes": diabetes_model is not None,
            "heart": heart_model is not None,
            "kidney": kidney_model is not None,
            "xray": xray_model is not None
        }
    })

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(prediction_history)

@app.route('/history/add', methods=['POST'])
def add_history():
    data = request.json
    prediction_history.append(data)
    return jsonify({"status": "saved"})

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
    prediction_history.append(result)
    return jsonify(result)

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
    prediction_history.append(result)
    return jsonify(result)

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
    prediction_history.append(result)
    return jsonify(result)

@app.route('/predict/xray', methods=['POST'])
def predict_xray():
    return jsonify({
        "type": "X-Ray",
        "result": "X-Ray analysis available on local version only",
        "confidence": 0,
        "prediction": 0
    })

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
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            max_tokens=500
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Groq error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)