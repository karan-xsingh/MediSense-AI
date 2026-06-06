import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Diabetes() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pregnancies: '', glucose: '', bloodpressure: '',
    skinthickness: '', insulin: '', bmi: '',
    dpf: '', age: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://karan18singh.pythonanywhere.com/predict/diabetes', {
        pregnancies: parseFloat(formData.pregnancies),
        glucose: parseFloat(formData.glucose),
        bloodpressure: parseFloat(formData.bloodpressure),
        skinthickness: parseFloat(formData.skinthickness),
        insulin: parseFloat(formData.insulin),
        bmi: parseFloat(formData.bmi),
        dpf: parseFloat(formData.dpf),
        age: parseFloat(formData.age)
      });
      setResult(response.data);
    } catch (error) {
      alert('Error connecting to backend!');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'pregnancies', label: 'Pregnancies', placeholder: 'e.g. 2' },
    { name: 'glucose', label: 'Glucose Level', placeholder: 'e.g. 120' },
    { name: 'bloodpressure', label: 'Blood Pressure', placeholder: 'e.g. 70' },
    { name: 'skinthickness', label: 'Skin Thickness', placeholder: 'e.g. 20' },
    { name: 'insulin', label: 'Insulin', placeholder: 'e.g. 80' },
    { name: 'bmi', label: 'BMI', placeholder: 'e.g. 25.5' },
    { name: 'dpf', label: 'Diabetes Pedigree Function', placeholder: 'e.g. 0.5' },
    { name: 'age', label: 'Age', placeholder: 'e.g. 30' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 px-8 flex items-center gap-4">
        <button onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 text-sm">← Back</button>
        <span className="text-3xl">🩺</span>
        <h1 className="text-2xl font-bold text-blue-400">Diabetes Prediction</h1>
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
                  focus:border-blue-500 transition-all"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900
            py-4 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? '🔄 Analyzing...' : '🔍 Predict Diabetes'}
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

export default Diabetes;