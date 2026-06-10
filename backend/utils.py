"""
MediSense AI - Utility Functions
Data validation, preprocessing and helper functions
"""
import numpy as np
from datetime import datetime

def validate_diabetes_input(data):
    """Validate and sanitize diabetes prediction input"""
    required = ['pregnancies', 'glucose', 'bloodpressure', 
                'skinthickness', 'insulin', 'bmi', 'dpf', 'age']
    
    errors = []
    for field in required:
        if field not in data:
            errors.append(f"Missing field: {field}")
            continue
        try:
            val = float(data[field])
            if val < 0:
                errors.append(f"{field} cannot be negative")
        except (ValueError, TypeError):
            errors.append(f"{field} must be a number")
    
    # Range validation
    if 'glucose' in data:
        if float(data.get('glucose', 0)) > 300:
            errors.append("Glucose value seems too high (>300)")
    if 'age' in data:
        if float(data.get('age', 0)) > 120:
            errors.append("Age value seems too high (>120)")
    if 'bmi' in data:
        if float(data.get('bmi', 0)) > 70:
            errors.append("BMI value seems too high (>70)")
    
    return errors

def validate_heart_input(data):
    """Validate heart disease prediction input"""
    required = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
                'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    errors = []
    for field in required:
        if field not in data:
            errors.append(f"Missing field: {field}")
    return errors

def validate_kidney_input(data):
    """Validate kidney disease prediction input"""
    required = ['age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc',
                'ba', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo',
                'pcv', 'wc', 'rc', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
    errors = []
    for field in required:
        if field not in data:
            errors.append(f"Missing field: {field}")
    return errors

def format_prediction_response(pred_type, prediction, probability, 
                                positive_label, negative_label):
    """Format consistent prediction response"""
    return {
        "type": pred_type,
        "prediction": int(prediction),
        "result": positive_label if prediction == 1 else negative_label,
        "confidence": round(float(max(probability)) * 100, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "disclaimer": "This is an AI prediction. Please consult a doctor."
    }

def get_risk_level(confidence, prediction):
    """Get risk level based on confidence and prediction"""
    if prediction == 0:
        return "Low Risk"
    if confidence >= 90:
        return "High Risk"
    elif confidence >= 70:
        return "Medium Risk"
    else:
        return "Low-Medium Risk"

def preprocess_image(image_bytes, target_size=(150, 150)):
    """Preprocess image for X-Ray model"""
    from PIL import Image
    import io
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)