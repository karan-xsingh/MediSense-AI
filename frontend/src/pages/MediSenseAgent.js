import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generatePDFReport } from '../PDFReport';

const API_URL = 'https://karan18singh.pythonanywhere.com';

function MediSenseAgent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('en');
  const [patientName, setPatientName] = useState('');
  const [xrayFile, setXrayFile] = useState(null);

  const [diabetesData, setDiabetesData] = useState({
    pregnancies: '6', glucose: '148', blood_pressure: '72',
    skin_thickness: '35', insulin: '0', bmi: '33.6',
    diabetes_pedigree: '0.627', age: '50'
  });

  const [heartData, setHeartData] = useState({
    cp: '3', trestbps: '145', chol: '233', fbs: '1',
    restecg: '0', thalach: '150', exang: '0',
    oldpeak: '2.3', slope: '0', ca: '0', thal: '1'
  });

  const [kidneyData, setKidneyData] = useState({
    sg: '1.02', al: '1', su: '0', rbc: '0', pc: '0',
    pcc: '0', ba: '0', bgr: '121', bu: '36', sc: '1.2',
    sod: '0', pot: '0', hemo: '15.4', pcv: '44',
    wbcc: '7800', rbcc: '5.2'
  });

  const urgencyColors = {
    LOW: 'border-green-500 bg-green-900/30',
    MEDIUM: 'border-yellow-500 bg-yellow-900/30',
    HIGH: 'border-orange-500 bg-orange-900/30',
    CRITICAL: 'border-red-500 bg-red-900/30',
  };

  const urgencyIcons = {
    LOW: '✅', MEDIUM: '⚠️', HIGH: '🚨', CRITICAL: '🆘'
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();

      // Patient info
      formData.append('patient_name', patientName || 'Patient');
      formData.append('language', language);

      // Diabetes features
      formData.append('pregnancies', diabetesData.pregnancies);
      formData.append('glucose', diabetesData.glucose);
      formData.append('blood_pressure', diabetesData.blood_pressure);
      formData.append('skin_thickness', diabetesData.skin_thickness);
      formData.append('insulin', diabetesData.insulin);
      formData.append('bmi', diabetesData.bmi);
      formData.append('diabetes_pedigree', diabetesData.diabetes_pedigree);
      formData.append('age', diabetesData.age);

      // Heart features
      formData.append('cp', heartData.cp);
      formData.append('trestbps', heartData.trestbps);
      formData.append('chol', heartData.chol);
      formData.append('fbs', heartData.fbs);
      formData.append('restecg', heartData.restecg);
      formData.append('thalach', heartData.thalach);
      formData.append('exang', heartData.exang);
      formData.append('oldpeak', heartData.oldpeak);
      formData.append('slope', heartData.slope);
      formData.append('ca', heartData.ca);
      formData.append('thal', heartData.thal);

      // Kidney features
      formData.append('sg', kidneyData.sg);
      formData.append('al', kidneyData.al);
      formData.append('su', kidneyData.su);
      formData.append('rbc', kidneyData.rbc);
      formData.append('pc', kidneyData.pc);
      formData.append('pcc', kidneyData.pcc);
      formData.append('ba', kidneyData.ba);
      formData.append('bgr', kidneyData.bgr);
      formData.append('bu', kidneyData.bu);
      formData.append('sc', kidneyData.sc);
      formData.append('sod', kidneyData.sod);
      formData.append('pot', kidneyData.pot);
      formData.append('hemo', kidneyData.hemo);
      formData.append('pcv', kidneyData.pcv);
      formData.append('wbcc', kidneyData.wbcc);
      formData.append('rbcc', kidneyData.rbcc);

      // X-Ray (optional)
      if (xrayFile) formData.append('xray', xrayFile);

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
    setLoading(false);
  };

  const InputField = ({ label, value, onChange, placeholder }) => (
    <div>
      <label className="block text-gray-400 text-xs mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
          text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-6 px-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')}
              className="text-purple-300 hover:text-white text-sm">← Back</button>
            <div>
              <h1 className="text-2xl font-bold">🤖 MediSense AMD Agent</h1>
              <p className="text-purple-300 text-sm">
                Powered by AMD MI300X via Fireworks AI • 4 ML Models • LLaMA 3.3 70B
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg text-sm font-medium"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>
            <div className="bg-purple-800/50 px-3 py-1 rounded-full text-xs text-purple-300">
              🔴 AMD MI300X Live
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-3 flex gap-6">
          {['Patient Info', 'Diabetes', 'Heart', 'Kidney', 'Analyze'].map((s, i) => (
            <button key={i} onClick={() => setStep(i + 1)}
              className={`text-sm font-medium pb-2 border-b-2 transition-all ${
                step === i + 1
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {i + 1}. {s}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-8">

        {/* Step 1 — Patient Info */}
        {step === 1 && (
          <div className="bg-gray-900 rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-6 text-purple-400">👤 Patient Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                    text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Report Language</label>
                <div className="flex gap-3">
                  {['en', 'hi'].map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        language === lang
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}>
                      {lang === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Chest X-Ray (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setXrayFile(e.target.files[0])}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                    text-gray-400 text-sm"
                />
                {xrayFile && (
                  <p className="text-green-400 text-xs mt-1">✅ {xrayFile.name}</p>
                )}
              </div>
            </div>
            <button onClick={() => setStep(2)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold">
              Next: Diabetes Data →
            </button>
          </div>
        )}

        {/* Step 2 — Diabetes */}
        {step === 2 && (
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-blue-400">🩺 Diabetes Parameters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField label="Pregnancies" value={diabetesData.pregnancies}
                onChange={v => setDiabetesData({...diabetesData, pregnancies: v})} placeholder="e.g. 6" />
              <InputField label="Glucose" value={diabetesData.glucose}
                onChange={v => setDiabetesData({...diabetesData, glucose: v})} placeholder="e.g. 148" />
              <InputField label="Blood Pressure" value={diabetesData.blood_pressure}
                onChange={v => setDiabetesData({...diabetesData, blood_pressure: v})} placeholder="e.g. 72" />
              <InputField label="Skin Thickness" value={diabetesData.skin_thickness}
                onChange={v => setDiabetesData({...diabetesData, skin_thickness: v})} placeholder="e.g. 35" />
              <InputField label="Insulin" value={diabetesData.insulin}
                onChange={v => setDiabetesData({...diabetesData, insulin: v})} placeholder="e.g. 0" />
              <InputField label="BMI" value={diabetesData.bmi}
                onChange={v => setDiabetesData({...diabetesData, bmi: v})} placeholder="e.g. 33.6" />
              <InputField label="Diabetes Pedigree" value={diabetesData.diabetes_pedigree}
                onChange={v => setDiabetesData({...diabetesData, diabetes_pedigree: v})} placeholder="e.g. 0.627" />
              <InputField label="Age" value={diabetesData.age}
                onChange={v => setDiabetesData({...diabetesData, age: v})} placeholder="e.g. 50" />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">
                ← Back
              </button>
              <button onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold">
                Next: Heart Data →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Heart */}
        {step === 3 && (
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-red-400">❤️ Heart Disease Parameters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField label="Chest Pain Type (0-3)" value={heartData.cp}
                onChange={v => setHeartData({...heartData, cp: v})} placeholder="e.g. 3" />
              <InputField label="Resting BP" value={heartData.trestbps}
                onChange={v => setHeartData({...heartData, trestbps: v})} placeholder="e.g. 145" />
              <InputField label="Cholesterol" value={heartData.chol}
                onChange={v => setHeartData({...heartData, chol: v})} placeholder="e.g. 233" />
              <InputField label="Fasting Blood Sugar" value={heartData.fbs}
                onChange={v => setHeartData({...heartData, fbs: v})} placeholder="0 or 1" />
              <InputField label="Rest ECG (0-2)" value={heartData.restecg}
                onChange={v => setHeartData({...heartData, restecg: v})} placeholder="e.g. 0" />
              <InputField label="Max Heart Rate" value={heartData.thalach}
                onChange={v => setHeartData({...heartData, thalach: v})} placeholder="e.g. 150" />
              <InputField label="Exercise Angina" value={heartData.exang}
                onChange={v => setHeartData({...heartData, exang: v})} placeholder="0 or 1" />
              <InputField label="ST Depression" value={heartData.oldpeak}
                onChange={v => setHeartData({...heartData, oldpeak: v})} placeholder="e.g. 2.3" />
              <InputField label="Slope (0-2)" value={heartData.slope}
                onChange={v => setHeartData({...heartData, slope: v})} placeholder="e.g. 0" />
              <InputField label="CA (0-3)" value={heartData.ca}
                onChange={v => setHeartData({...heartData, ca: v})} placeholder="e.g. 0" />
              <InputField label="Thal (0-3)" value={heartData.thal}
                onChange={v => setHeartData({...heartData, thal: v})} placeholder="e.g. 1" />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">
                ← Back
              </button>
              <button onClick={() => setStep(4)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold">
                Next: Kidney Data →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Kidney */}
        {step === 4 && (
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6 text-yellow-400">🫘 Kidney Disease Parameters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField label="Specific Gravity" value={kidneyData.sg}
                onChange={v => setKidneyData({...kidneyData, sg: v})} placeholder="e.g. 1.02" />
              <InputField label="Albumin" value={kidneyData.al}
                onChange={v => setKidneyData({...kidneyData, al: v})} placeholder="e.g. 1" />
              <InputField label="Sugar" value={kidneyData.su}
                onChange={v => setKidneyData({...kidneyData, su: v})} placeholder="e.g. 0" />
              <InputField label="Red Blood Cells" value={kidneyData.rbc}
                onChange={v => setKidneyData({...kidneyData, rbc: v})} placeholder="0 or 1" />
              <InputField label="Pus Cell" value={kidneyData.pc}
                onChange={v => setKidneyData({...kidneyData, pc: v})} placeholder="0 or 1" />
              <InputField label="Pus Cell Clumps" value={kidneyData.pcc}
                onChange={v => setKidneyData({...kidneyData, pcc: v})} placeholder="0 or 1" />
              <InputField label="Bacteria" value={kidneyData.ba}
                onChange={v => setKidneyData({...kidneyData, ba: v})} placeholder="0 or 1" />
              <InputField label="Blood Glucose" value={kidneyData.bgr}
                onChange={v => setKidneyData({...kidneyData, bgr: v})} placeholder="e.g. 121" />
              <InputField label="Blood Urea" value={kidneyData.bu}
                onChange={v => setKidneyData({...kidneyData, bu: v})} placeholder="e.g. 36" />
              <InputField label="Serum Creatinine" value={kidneyData.sc}
                onChange={v => setKidneyData({...kidneyData, sc: v})} placeholder="e.g. 1.2" />
              <InputField label="Haemoglobin" value={kidneyData.hemo}
                onChange={v => setKidneyData({...kidneyData, hemo: v})} placeholder="e.g. 15.4" />
              <InputField label="Packed Cell Volume" value={kidneyData.pcv}
                onChange={v => setKidneyData({...kidneyData, pcv: v})} placeholder="e.g. 44" />
              <InputField label="WBC Count" value={kidneyData.wbcc}
                onChange={v => setKidneyData({...kidneyData, wbcc: v})} placeholder="e.g. 7800" />
              <InputField label="RBC Count" value={kidneyData.rbcc}
                onChange={v => setKidneyData({...kidneyData, rbcc: v})} placeholder="e.g. 5.2" />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(3)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">
                ← Back
              </button>
              <button onClick={() => setStep(5)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-xl font-bold">
                Next: Review & Analyze →
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Analyze */}
        {step === 5 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4 text-purple-400">
                🚀 Ready to Analyze
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Patient', value: patientName || 'Anonymous', icon: '👤' },
                  { label: 'Language', value: language === 'en' ? 'English' : 'हिंदी', icon: '🌐' },
                  { label: 'X-Ray', value: xrayFile ? '✅ Uploaded' : '⏭️ Skipped', icon: '🫁' },
                  { label: 'AI Engine', value: 'AMD MI300X', icon: '🔴' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-bold text-white mt-1">{item.value}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600
                  hover:from-purple-700 hover:to-blue-700 disabled:opacity-50
                  py-4 rounded-xl font-bold text-lg transition-all"
              >
                {loading
                  ? '🔄 AMD MI300X Processing...'
                  : '🤖 Run Full AI Analysis'}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Urgency Banner */}
                <div className={`rounded-2xl p-6 border-2 text-center ${urgencyColors[result.urgency]}`}>
                  <div className="text-5xl mb-2">{urgencyIcons[result.urgency]}</div>
                  <h3 className="text-3xl font-bold mb-1">
                    {result.urgency} RISK
                  </h3>
                  <p className="text-gray-300">Patient: {result.patient_name}</p>
                  {result.risk_flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {result.risk_flags.map((flag, i) => (
                        <span key={i}
                          className="bg-red-900/50 border border-red-500 px-3 py-1 rounded-full text-sm">
                          ⚠️ {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Diabetes Risk', value: result.predictions.diabetes_risk, color: 'blue' },
                    { label: 'Heart Disease', value: result.predictions.heart_disease_risk, color: 'red' },
                    { label: 'Kidney Disease', value: result.predictions.kidney_disease_risk, color: 'yellow' },
                    { label: 'Pneumonia', value: result.predictions.pneumonia_risk ?? 'N/A', color: 'green' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                      <div className="text-2xl font-bold text-white mb-1">
                        {item.value !== 'N/A' ? `${item.value}%` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      {item.value !== 'N/A' && (
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${item.color}-500 rounded-full`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Clinical Summary */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-purple-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-400">AI Clinical Summary</h3>
                      <p className="text-xs text-gray-500">{result.powered_by}</p>
                    </div>
                  </div>
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {result.clinical_summary}
                  </div>
                </div>

                {/* Timings */}
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <h4 className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                    ⚡ AMD Performance Metrics
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(result.timings_ms).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-green-400">{val}ms</div>
                        <div className="text-xs text-gray-500">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                

                // Add download button before disclaimer
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button
                    onClick={() => generatePDFReport(result)}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      border: 'none', borderRadius: '12px',
                      padding: '12px 32px', color: '#fff',
                      fontSize: '15px', fontWeight: 700,
                      cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                      }}>
                    📄 Download Clinical Report PDF
                  </button>
                </div>
                <p className="text-center text-gray-500 text-xs">
                  ⚕️ This is an AI-powered screening tool. Always consult a qualified doctor for medical advice.

                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  );
}

export default MediSenseAgent;