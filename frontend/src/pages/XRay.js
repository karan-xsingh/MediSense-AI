import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function XRay() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload an X-Ray image first!');
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const response = await axios.post('https://karan18singh.pythonanywhere.com/predict/xray', {
          image: base64
        });
        setResult(response.data);
        setLoading(false);
      };
      reader.readAsDataURL(image);
    } catch (error) {
      alert('Error connecting to backend!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 px-8 flex items-center gap-4">
        <button onClick={() => navigate('/')}
          className="text-purple-400 hover:text-purple-300 text-sm">← Back</button>
        <span className="text-3xl">🔬</span>
        <h1 className="text-2xl font-bold text-purple-400">Chest X-Ray Analysis</h1>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-gray-200">
            Upload Chest X-Ray Image
          </h2>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-purple-500 rounded-xl p-8
            text-center cursor-pointer hover:border-purple-400 transition-all"
            onClick={() => document.getElementById('xray-input').click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="X-Ray Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <div>
                <div className="text-6xl mb-4">🫁</div>
                <p className="text-gray-400">Click to upload X-Ray image</p>
                <p className="text-gray-600 text-sm mt-2">JPG, PNG supported</p>
              </div>
            )}
          </div>

          <input
            id="xray-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {preview && (
            <button
              onClick={() => { setPreview(null); setImage(null); setResult(null); }}
              className="mt-4 text-red-400 hover:text-red-300 text-sm"
            >
              ✕ Remove Image
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !image}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700
            disabled:bg-purple-900 disabled:cursor-not-allowed
            py-4 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? '🔄 Analyzing X-Ray...' : '🔍 Analyze X-Ray'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-8 rounded-2xl p-8 shadow-xl text-center
            ${result.result === 'Pneumonia Detected'
              ? 'bg-red-900/50 border border-red-500'
              : 'bg-green-900/50 border border-green-500'}`}>
            <div className="text-6xl mb-4">
              {result.result === 'Pneumonia Detected' ? '⚠️' : '✅'}
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

export default XRay;