import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7'];

function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history');
    }
  };

  // Count predictions by type
  const typeCounts = ['Diabetes', 'Heart Disease', 'Kidney Disease', 'X-Ray'].map(type => ({
    name: type,
    count: history.filter(h => h.type === type).length
  }));

  // Count positive vs negative
  const positive = history.filter(h => h.prediction === 1 || h.prediction > 0.5).length;
  const negative = history.length - positive;
  const pieData = [
    { name: 'Positive', value: positive },
    { name: 'Negative', value: negative }
  ];

  // Average confidence
  const avgConfidence = history.length > 0
    ? (history.reduce((sum, h) => sum + h.confidence, 0) / history.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 px-8 flex items-center gap-4">
        <button onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 text-sm">← Back</button>
        <span className="text-3xl">📊</span>
        <h1 className="text-2xl font-bold text-blue-400">Patient Dashboard</h1>
        <button
          onClick={fetchHistory}
          className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-blue-400">{history.length}</p>
            <p className="text-gray-400 mt-2">Total Predictions</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-red-400">{positive}</p>
            <p className="text-gray-400 mt-2">Positive Cases</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-green-400">{negative}</p>
            <p className="text-gray-400 mt-2">Negative Cases</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-purple-400">{avgConfidence}%</p>
            <p className="text-gray-400 mt-2">Avg Confidence</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Bar Chart */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              Predictions by Type
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              Positive vs Negative
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#ef4444' : '#22c55e'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-200">
            Recent Predictions
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No predictions yet. Start predicting!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Result</th>
                    <th className="text-left py-3 px-4">Confidence</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-all">
                      <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">{item.type}</td>
                      <td className="py-3 px-4 text-gray-300">{item.result}</td>
                      <td className="py-3 px-4 text-blue-400">{item.confidence}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                          ${item.prediction === 1 || item.prediction > 0.5
                            ? 'bg-red-900 text-red-300'
                            : 'bg-green-900 text-green-300'}`}>
                          {item.prediction === 1 || item.prediction > 0.5
                            ? '⚠️ Positive' : '✅ Negative'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;