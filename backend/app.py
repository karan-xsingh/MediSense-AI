import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import joblib
import tensorflow as tf
from PIL import Image
import io
import base64
import warnings
from groq import Groq
warnings.filterwarnings('ignore')

load_dotenv()
app = Flask(__name__)
CORS(app)

# Groq Client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Prediction history storage
prediction_history = []

# Load all models
print("Loading models...")
diabetes_model = joblib.load('models/diabetes_model.pkl')
heart_model = joblib.load('models/heart_model.pkl')
kidney_model = joblib.load('models/kidney_model.pkl')
xray_model = tf.keras.models.load_model('models/xray_model.h5')
print("✅ All models loaded!")

@app.route('/')
def home():
    return jsonify({"message": "MediSense AI Backend Running!", "status": "success"})

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
    prediction_history.append(result)
    return jsonify(result)

# Test route
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