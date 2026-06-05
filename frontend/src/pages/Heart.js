import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Heart() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '', sex: '', cp: '', trestbps: '',
    chol: '', fbs: '', restecg: '', thalach: '',
    exang: '', oldpeak: '', slope: '', ca: '', thal: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://karan18singh.pythonanywhere.com/predict/heart', {
        age: parseFloat(formData.age),
        sex: parseFloat(formData.sex),
        cp: parseFloat(formData.cp),
        trestbps: parseFloat(formData.trestbps),
        chol: parseFloat(formData.chol),
        fbs: parseFloat(formData.fbs),
        restecg: parseFloat(formData.restecg),
        thalach: parseFloat(formData.thalach),
        exang: parseFloat(formData.exang),
        oldpeak: parseFloat(formData.oldpeak),
        slope: parseFloat(formData.slope),
        ca: parseFloat(formData.ca),
        thal: parseFloat(formData.thal)
      });
      setResult(response.data);
    } catch (error) {
      alert('Error connecting to backend!');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'age', label: 'Age', placeholder: 'e.g. 45' },
    { name: 'sex', label: 'Sex (0=Female, 1=Male)', placeholder: '0 or 1' },
    { name: 'cp', label: 'Chest Pain Type (0-3)', placeholder: 'e.g. 1' },
    { name: 'trestbps', label: 'Resting Blood Pressure', placeholder: 'e.g. 120' },
    { name: 'chol', label: 'Cholesterol', placeholder: 'e.g. 200' },
    { name: 'fbs', label: 'Fasting Blood Sugar >120 (0/1)', placeholder: '0 or 1' },
    { name: 'restecg', label: 'Resting ECG (0-2)', placeholder: 'e.g. 1' },
    { name: 'thalach', label: 'Max Heart Rate', placeholder: 'e.g. 150' },
    { name: 'exang', label: 'Exercise Induced Angina (0/1)', placeholder: '0 or 1' },
    { name: 'oldpeak', label: 'ST Depression', placeholder: 'e.g. 1.5' },
    { name: 'slope', label: 'Slope (0-2)', placeholder: 'e.g. 1' },
    { name: 'ca', label: 'Major Vessels (0-3)', placeholder: 'e.g. 0' },
    { name: 'thal', label: 'Thal (0-3)', placeholder: 'e.g. 2' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 px-8 flex items-center gap-4">
        <button onClick={() => navigate('/')}
          className="text-red-400 hover:text-red-300 text-sm">← Back</button>
        <span className="text-3xl">❤️</span>
        <h1 className="text-2xl font-bold text-red-400">Heart Disease Prediction</h1>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-gray-200">Enter Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-400 text-sm mb-2">{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg
                  px-4 py-3 text-white placeholder-gray-500 focus:outline-none
                  focus:border-red-500 transition-all"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900
            py-4 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? '🔄 Analyzing...' : '🔍 Predict Heart Disease'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-8 rounded-2xl p-8 shadow-xl text-center
            ${result.prediction === 1 ? 'bg-red-900/50 border border-red-500'
            : 'bg-green-900/50 border border-green-500'}`}>
            <div className="text-6xl mb-4">
              {result.prediction === 1 ? '⚠️' : '✅'}
            </div>
            <h3 className="text-3xl font-bold mb-2">{result.result}</h3>
            <p className="text-gray-300 text-lg">
              Confidence: <span className="font-bold text-white">{result.confidence}%</span>
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              This is an AI prediction. Please consult a doctor for medical advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Heart;