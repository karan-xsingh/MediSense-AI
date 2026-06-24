"""
MediSense AMD — AI Agent Pipeline
Powered by AMD MI300X via Fireworks AI
"""

import os
import time
import joblib
import numpy as np
import torch
import tensorflow as tf
from PIL import Image
import requests
from dotenv import load_dotenv
 
load_dotenv()
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

FIREWORKS_API_KEY = ("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")
FIREWORKS_URL     = "https://api.groq.com/openai/v1/chat/completions"
MODEL_ID          = "llama-3.3-70b-versatile"

def preprocess_xray(image_path: str) -> np.ndarray:
    img = Image.open(image_path).convert("RGB")
    img = img.resize((150, 150))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0).astype(np.float32)


def call_llm(prompt: str, language: str = "en") -> str:
    lang_instruction = (
        "Respond in Hindi language using Devanagari script."
        if language == "hi"
        else "Respond in clear English."
    )
    headers = {
        "Authorization": f"Bearer {FIREWORKS_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL_ID,
        "max_tokens": 512,
        "messages": [
            {
                "role": "system",
                "content": (
                    f"You are MediSense AI, a clinical assistant. {lang_instruction} "
                    "Be concise, clear, and always recommend seeing a doctor for serious conditions."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    }
    try:
        resp = requests.post(FIREWORKS_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"LLM error: {str(e)}"


class MediSenseAgent:
    def __init__(self, models_dir: str = "models"):
        print("[MediSense AMD] Loading models...")

        self.diabetes_model = joblib.load(f"{models_dir}/diabetes_model.pkl")
        self.heart_model    = joblib.load(f"{models_dir}/heart_model.pkl")
        self.kidney_model   = joblib.load(f"{models_dir}/kidney_model.pkl")
        print("[MediSense AMD] ✅ Disease prediction models loaded")

        xray_path = f"{models_dir}/xray_model.h5"
        if os.path.exists(xray_path):
            self.xray_model = tf.keras.models.load_model(xray_path)
            print("[MediSense AMD] ✅ X-Ray CNN loaded (TensorFlow)")
        else:
            self.xray_model = None
            print("[MediSense AMD] ⚠️ X-Ray model not found")

        print("[MediSense AMD] ✅ All models ready!")
        print(f"[MediSense AMD] 🚀 LLM: DeepSeek-V3 on AMD MI300X via Fireworks AI")

    def analyze(
        self,
        diabetes_features: list,
        heart_features: list,
        kidney_features: list,
        xray_image_path: str = None,
        language: str = "en",
        patient_name: str = "Patient",
    ) -> dict:

        results    = {}
        timings    = {}
        risk_flags = []

        t0     = time.time()
        d_prob = float(self.diabetes_model.predict_proba([diabetes_features])[0][1])
        h_prob = float(self.heart_model.predict_proba([heart_features])[0][1])
        k_prob = float(self.kidney_model.predict_proba([kidney_features])[0][1])
        timings["disease_models_ms"] = round((time.time() - t0) * 1000, 2)

        results["diabetes_risk"]       = round(d_prob * 100, 1)
        results["heart_disease_risk"]  = round(h_prob * 100, 1)
        results["kidney_disease_risk"] = round(k_prob * 100, 1)

        if d_prob > 0.6: risk_flags.append("High Diabetes Risk")
        if h_prob > 0.6: risk_flags.append("High Heart Disease Risk")
        if k_prob > 0.6: risk_flags.append("High Kidney Disease Risk")

        pneumonia_prob = None
        if xray_image_path and os.path.exists(xray_image_path) and self.xray_model:
            t0             = time.time()
            img_array      = preprocess_xray(xray_image_path)
            pneumonia_prob = float(self.xray_model.predict(img_array, verbose=0)[0][0])
            timings["xray_inference_ms"] = round((time.time() - t0) * 1000, 2)
            results["pneumonia_risk"]    = round(pneumonia_prob * 100, 1)
            if pneumonia_prob > 0.5:
                risk_flags.append("Pneumonia Detected in X-Ray")

        t0       = time.time()
        xray_line = (
            f"- Chest X-Ray Pneumonia Risk: {results.get('pneumonia_risk', 'N/A')}%"
            if pneumonia_prob is not None
            else "- Chest X-Ray: Not provided"
        )

        prompt = f"""
Patient: {patient_name}
Analysis Results:
- Diabetes Risk:       {results['diabetes_risk']}%
- Heart Disease Risk:  {results['heart_disease_risk']}%
- Kidney Disease Risk: {results['kidney_disease_risk']}%
{xray_line}
Risk Flags: {', '.join(risk_flags) if risk_flags else 'None'}

Please provide:
1. Overall health assessment (2-3 sentences)
2. Immediate actions recommended
3. Urgency level: LOW / MEDIUM / HIGH / CRITICAL
4. Specialist referral needed (yes/no and which type)
"""
        clinical_summary  = call_llm(prompt, language)
        timings["llm_ms"] = round((time.time() - t0) * 1000, 2)

        urgency = "LOW"
        if len(risk_flags) >= 3:   urgency = "CRITICAL"
        elif len(risk_flags) == 2: urgency = "HIGH"
        elif len(risk_flags) == 1: urgency = "MEDIUM"

        return {
            "patient_name":     patient_name,
            "predictions":      results,
            "risk_flags":       risk_flags,
            "urgency":          urgency,
            "clinical_summary": clinical_summary,
            "language":         language,
            "timings_ms":       timings,
            "powered_by":       "AMD MI300X via Fireworks AI + TensorFlow CNN",
        }


if __name__ == "__main__":
    agent = MediSenseAgent(models_dir="models")
    print("\n[MediSense AMD] Running test analysis...")

    result = agent.analyze(
        diabetes_features=[6, 148, 72, 35, 0, 33.6, 0.627, 50],
        heart_features=[63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1],
        kidney_features=[48, 80, 1.02, 1, 0, 0, 0, 0, 0, 121,
                         36, 1.2, 0, 0, 15400, 7800, 46, 4.71,
                         1, 1, 1, 1, 1, 1],
        xray_image_path=None,
        language="en",
        patient_name="Test Patient",
    )

    print("\n" + "="*50)
    print("  MediSense AMD — Test Result")
    print("="*50)
    print(f"Patient:    {result['patient_name']}")
    print(f"Urgency:    {result['urgency']}")
    print(f"Flags:      {result['risk_flags']}")
    print(f"Timings:    {result['timings_ms']}")
    print(f"Powered by: {result['powered_by']}")
    print(f"\nClinical Summary:\n{result['clinical_summary']}")
    print("="*50)