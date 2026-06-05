import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Kidney() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '', bp: '', sg: '', al: '', su: '',
    rbc: '', pc: '', pcc: '', ba: '', bgr: '',
    bu: '', sc: '', sod: '', pot: '', hemo: '',
    pcv: '', wc: '', rc: '', htn: '', dm: '',
    cad: '', appet: '', pe: '', ane: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://karan18singh.pythonanywhere.com/predict/kidney',
        Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
        )
      );
      setResult(response.data);
    } catch (error) {
      alert('Error connecting to backend!');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'age', label: 'Age', placeholder: 'e.g. 45' },
    { name: 'bp', label: 'Blood Pressure', placeholder: 'e.g. 80' },
    { name: 'sg', label: 'Specific Gravity', placeholder: 'e.g. 1.020' },
    { name: 'al', label: 'Albumin (0-5)', placeholder: 'e.g. 1' },
    { name: 'su', label: 'Sugar (0-5)', placeholder: 'e.g. 0' },
    { name: 'rbc', label: 'Red Blood Cells (0/1)', placeholder: '0 or 1' },
    { name: 'pc', label: 'Pus Cell (0/1)', placeholder: '0 or 1' },
    { name: 'pcc', label: 'Pus Cell Clumps (0/1)', placeholder: '0 or 1' },
    { name: 'ba', label: 'Bacteria (0/1)', placeholder: '0 or 1' },
    { name: 'bgr', label: 'Blood Glucose Random', placeholder: 'e.g. 120' },
    { name: 'bu', label: 'Blood Urea', placeholder: 'e.g. 36' },
    { name: 'sc', label: 'Serum Creatinine', placeholder: 'e.g. 1.2' },
    { name: 'sod', label: 'Sodium', placeholder: 'e.g. 137' },
    { name: 'pot', label: 'Potassium', placeholder: 'e.g. 4.5' },
    { name: 'hemo', label: 'Hemoglobin', placeholder: 'e.g. 14' },
    { name: 'pcv', label: 'Packed Cell Volume', placeholder: 'e.g. 41' },
    { name: 'wc', label: 'White Blood Cell Count', placeholder: 'e.g. 7800' },
    { name: 'rc', label: 'Red Blood Cell Count', placeholder: 'e.g. 5.2' },
    { name: 'htn', label: 'Hypertension (0/1)', placeholder: '0 or 1' },
    { name: 'dm', label: 'Diabetes Mellitus (0/1)', placeholder: '0 or 1' },
    { name: 'cad', label: 'Coronary Artery Disease (0/1)', placeholder: '0 or 1' },
    { name: 'appet', label: 'Appetite (0=Poor, 1=Good)', placeholder: '0 or 1' },
    { name: 'pe', label: 'Pedal Edema (0/1)', placeholder: '0 or 1' },
    { name: 'ane', label: 'Anemia (0/1)', placeholder: '0 or 1' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 px-8 flex items-center gap-4">
        <button onClick={() => navigate('/')}
          className="text-green-400 hover:text-green-300 text-sm">← Back</button>
        <span className="text-3xl">🫘</span>
        <h1 className="text-2xl font-bold text-green-400">Kidney Disease Prediction</h1>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6">
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
                  focus:border-green-500 transition-all"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900
            py-4 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? '🔄 Analyzing...' : '🔍 Predict Kidney Disease'}
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

export default Kidney;