import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: "MediSense AI",
    tagline: "Powered by Deep Learning",
    hero1: "Healthcare Meets",
    hero2: "Artificial Intelligence",
    subtitle: "Four advanced ML models trained on real clinical data. Predict diseases instantly with accuracy doctors trust.",
    analyzeBtn: "🔍 Analyze Now",
    dashboardBtn: "📊 View Dashboard",
    chooseModel: "Choose a",
    predictionModel: "Prediction Model",
    trainedOn: "Trained on thousands of real patient records",
    aiModels: "AI Models",
    bestAccuracy: "Best Accuracy",
    kidneyScore: "Kidney Score",
    alwaysOpen: "Always Open",
    techStack: "Tech Stack",
    aiDetection: "AI Disease Detection",
    cards: [
      { title: "Diabetes Prediction", desc: "Predict diabetes risk using 8 key health parameters." },
      { title: "Heart Disease", desc: "Detect heart disease risk from 13 clinical markers." },
      { title: "Kidney Disease", desc: "Early CKD detection using 24 lab parameters." },
      { title: "X-Ray Analysis", desc: "CNN detects pneumonia from chest X-rays instantly." }
    ]
  },
  hi: {
    appName: "मेडीसेंस AI",
    tagline: "डीप लर्निंग द्वारा संचालित",
    hero1: "स्वास्थ्य सेवा मिलती है",
    hero2: "आर्टिफिशियल इंटेलिजेंस से",
    subtitle: "वास्तविक क्लिनिकल डेटा पर प्रशिक्षित चार उन्नत ML मॉडल। बीमारियों की भविष्यवाणी तुरंत करें।",
    analyzeBtn: "🔍 जांच करें",
    dashboardBtn: "📊 डैशबोर्ड देखें",
    chooseModel: "चुनें एक",
    predictionModel: "भविष्यवाणी मॉडल",
    trainedOn: "हजारों वास्तविक रोगी रिकॉर्ड पर प्रशिक्षित",
    aiModels: "AI मॉडल",
    bestAccuracy: "सर्वश्रेष्ठ सटीकता",
    kidneyScore: "किडनी स्कोर",
    alwaysOpen: "हमेशा मुफ्त",
    techStack: "तकनीक",
    aiDetection: "AI रोग पहचान",
    cards: [
      { title: "मधुमेह भविष्यवाणी", desc: "8 स्वास्थ्य मापदंडों का उपयोग करके मधुमेह के जोखिम की भविष्यवाणी करें।" },
      { title: "हृदय रोग", desc: "13 नैदानिक मार्करों से हृदय रोग के जोखिम का पता लगाएं।" },
      { title: "किडनी रोग", desc: "24 लैब मापदंडों का उपयोग करके CKD का जल्द पता लगाएं।" },
      { title: "X-Ray विश्लेषण", desc: "CNN छाती के X-Ray से निमोनिया का तुरंत पता लगाता है।" }
    ]
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);