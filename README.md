# MediSense AI
# 🏥 MediSense AI

> AI-Powered Healthcare Platform for Rural & Urban India

![MediSense AI](https://img.shields.io/badge/Status-Live-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange)

## 🌍 Live Demo
- **Frontend:** https://medisense-india.vercel.app
- **Backend API:** https://karan18singh.pythonanywhere.com
- **WhatsApp Bot:** +1 415 523 8886 (send: join college-require)
- **GitHub:** https://github.com/karan-xsingh/MediSense-AI

## 📊 Model Performance

| Disease | Algorithm | Accuracy | CV Score | F1 Score |
|---------|-----------|----------|----------|----------|
| Diabetes | Gradient Boosting | 74% | 76% ± 2.9% | 0.74 |
| Heart Disease | Random Forest | 98% | 97% ± 1.2% | 0.98 |
| Kidney Disease | Random Forest | 98% | 99% ± 1.0% | 0.99 |
| Chest X-Ray | CNN (4 layers) | 95% | - | 0.95 |

## 🚀 Features

- 🩺 **4 ML/DL Disease Prediction Models**
- 🤖 **MediBot AI Chatbot** (Groq LLaMA 3.3 70B)
- 📱 **WhatsApp Bot** via Twilio
- 🇮🇳 **Hindi/English** language toggle
- 🎤 **Voice Input** for low literacy users
- 📊 **Real-time Analytics Dashboard**
- 💾 **SQLite Database** for prediction history
- 📱 **Mobile Responsive** (optimized for 360px+)

## 🛠️ Tech Stack

### Backend
- Python 3.13, Flask, SQLite
- Scikit-learn, TensorFlow, NumPy, Pandas
- Groq API (LLaMA 3.3 70B), Twilio API

### Frontend
- React.js 18, Tailwind CSS
- Recharts, Axios
- Web Speech API (Voice Input)

### Deployment
- Frontend: Vercel
- Backend: PythonAnywhere
- Version Control: GitHub

## 📁 Project Structure
## 📁 Project Structure

```
MediSense-AI/
├── backend/                      # Flask API server
│   ├── app.py                    # Main Flask app & API routes
│   ├── agent.py                  # MediBot AI agent logic
│   ├── doctor.py                 # AI Doctor / diagnosis logic
│   ├── config.py                 # App configuration
│   ├── reminders.py               # Medication/appointment reminders
│   ├── utils.py                   # Shared helper functions
│   ├── model_evaluation.py        # ML model evaluation scripts
│   ├── API_DOCS.md                # API endpoint documentation
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Environment variable template
│
├── frontend/                      # React + Tailwind client
│   ├── public/                    # Static assets
│   └── src/
│       ├── App.js                 # Root component & routing
│       ├── AiDoctor.js            # AI Doctor interface
│       ├── MediSenseAgent.js      # MediBot chat interface
│       ├── PDFReport.js           # PDF report generation
│       ├── components/
│       │   └── Chatbot.js         # Chat UI component
│       ├── context/
│       │   └── LanguageContext.js # Hindi/English toggle state
│       └── pages/                 # Route-level pages
│           ├── Home.js
│           ├── Dashboard.js
│           ├── Diabetes.js
│           ├── Heart.js
│           ├── Kidney.js
│           ├── XRay.js
│           ├── AiDoctor.js
│           └── MediSenseAgent.js
│
├── notebooks/
│   └── train_models.ipynb         # Model training notebook
│
└── README.md
```
