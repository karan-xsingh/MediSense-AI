import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Diabetes from './pages/Diabetes';
import Heart from './pages/Heart';
import Kidney from './pages/Kidney';
import XRay from './pages/XRay';
import Dashboard from './pages/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diabetes" element={<Diabetes />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/kidney" element={<Kidney />} />
        <Route path="/xray" element={<XRay />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;