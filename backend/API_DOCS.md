# MediSense AI - API Documentation

## Base URL
https://karan18singh.pythonanywhere.com

## Endpoints

### GET /
Health check
Response: {"message": "MediSense AI Backend Running!", "status": "success"}

### POST /predict/diabetes
Predict diabetes risk
Body: {pregnancies, glucose, bloodpressure, skinthickness, insulin, bmi, dpf, age}

### POST /predict/heart
Predict heart disease
Body: {age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal}

### POST /predict/kidney
Predict kidney disease
Body: {age, bp, sg, al, su, rbc, pc, pcc, ba, bgr, bu, sc, sod, pot, hemo, pcv, wc, rc, htn, dm, cad, appet, pe, ane}

### POST /predict/xray
Analyze chest X-ray
Body: {image: base64_encoded_image}

### POST /chat
MediBot chatbot
Body: {message: "your question"}

### GET /history
Get prediction history

### POST /whatsapp
WhatsApp webhook