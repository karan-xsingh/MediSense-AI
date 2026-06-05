import React from 'react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title: "Diabetes Prediction",
    desc: "Uses glucose, BMI, insulin levels and 5 more parameters to predict diabetes risk with Random Forest ML.",
    icon: "🩺",
    path: "/diabetes",
    accuracy: 72,
    color: "blue",
    badge: "Random Forest"
  },
  {
    title: "Heart Disease",
    desc: "Analyzes 13 clinical markers including ECG data and cholesterol to detect cardiovascular risk.",
    icon: "❤️",
    path: "/heart",
    accuracy: 98,
    color: "red",
    badge: "Random Forest"
  },
  {
    title: "Kidney Disease",
    desc: "24 lab parameters including creatinine and hemoglobin analyzed for early CKD detection.",
    icon: "🫘",
    path: "/kidney",
    accuracy: 100,
    color: "green",
    badge: "Random Forest"
  },
  {
    title: "X-Ray Analysis",
    desc: "Deep CNN with 4 convolutional layers detects pneumonia from chest X-rays in under a second.",
    icon: "🔬",
    path: "/xray",
    accuracy: 95,
    color: "purple",
    badge: "Deep Learning"
  }
];

const techs = [
  "⚛️ React.js", "🐍 Flask", "🤖 TensorFlow",
  "📊 Scikit-learn", "🎨 Tailwind CSS", "📈 Recharts",
  "🧠 Random Forest", "🔬 CNN", "🗂️ Pandas", "🔢 NumPy"
];

const colorMap = {
  blue:   { card: '#1e1b4b', border: 'rgba(99,102,241,0.3)',  glow: 'rgba(99,102,241,0.15)',  acc: 'linear-gradient(90deg,#6366f1,#818cf8)',  num: '#818cf8', badge: 'rgba(99,102,241,0.15)',  badgeText: '#818cf8'  },
  red:    { card: '#1f1215', border: 'rgba(239,68,68,0.3)',   glow: 'rgba(239,68,68,0.15)',   acc: 'linear-gradient(90deg,#ef4444,#f87171)',  num: '#f87171', badge: 'rgba(239,68,68,0.15)',   badgeText: '#f87171'  },
  green:  { card: '#052e16', border: 'rgba(34,197,94,0.3)',   glow: 'rgba(34,197,94,0.15)',   acc: 'linear-gradient(90deg,#22c55e,#4ade80)',  num: '#4ade80', badge: 'rgba(34,197,94,0.15)',   badgeText: '#4ade80'  },
  purple: { card: '#1a0533', border: 'rgba(168,85,247,0.3)',  glow: 'rgba(168,85,247,0.15)',  acc: 'linear-gradient(90deg,#a855f7,#c084fc)',  num: '#c084fc', badge: 'rgba(168,85,247,0.15)',  badgeText: '#c084fc'  }
};

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#03040a', color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .card-hover { transition: all 0.4s cubic-bezier(0.23,1,0.32,1); cursor: pointer; }
        .card-hover:hover { transform: translateY(-10px) scale(1.02) !important; }
        .btn-main { transition: all 0.3s; border: none; cursor: pointer; }
        .btn-main:hover { transform: translateY(-3px); box-shadow: 0 0 60px rgba(99,102,241,0.7) !important; }
        .btn-sec { transition: all 0.3s; cursor: pointer; }
        .btn-sec:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        .pill-nav { transition: all 0.2s; cursor: pointer; }
        .pill-nav:hover { background: rgba(99,102,241,0.2) !important; border-color: rgba(99,102,241,0.5) !important; color: #a5b4fc !important; }
        .tech-tag { transition: all 0.2s; cursor: default; }
        .tech-tag:hover { border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; background: rgba(99,102,241,0.08) !important; }
        .card-arrow { transition: all 0.3s; }
        .card-hover:hover .card-arrow { transform: rotate(-45deg) !important; background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* Grid Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      {/* Gradient Blobs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-50px', right: '-50px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', background: 'rgba(3,4,10,0.85)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>🏥</div>
            <span style={{ fontSize: '17px', fontWeight: 800, background: 'linear-gradient(90deg,#a5b4fc,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediSense AI</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Home', 'Models', 'About'].map(item => (
              <div key={item} className="pill-nav" style={{ padding: '7px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}>{item}</div>
            ))}
          </div>
          <button className="btn-main" onClick={() => navigate('/dashboard')} style={{ padding: '8px 20px', borderRadius: '100px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', fontSize: '13px', fontWeight: 600, boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}>
            📊 Dashboard
          </button>
        </nav>

        {/* Hero */}
        <div style={{ padding: '100px 40px 60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 5px 5px 16px', borderRadius: '100px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: '#a5b4fc', marginBottom: '32px' }}>
            <span>Powered by Deep Learning</span>
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#fff', fontWeight: 600 }}>New: X-Ray AI</span>
          </div>

          <h1 style={{ fontSize: '68px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: '24px' }}>
            <span style={{ color: '#fff' }}>Healthcare Meets<br /></span>
            <span style={{ background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 40%,#38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Artificial Intelligence</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Four advanced ML models trained on real clinical data. Predict diseases instantly with accuracy doctors trust.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '64px' }}>
            <button className="btn-main" onClick={() => navigate('/diabetes')} style={{ padding: '14px 36px', borderRadius: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: 700, boxShadow: '0 0 40px rgba(99,102,241,0.45)' }}>
              🔍 Analyze Now
            </button>
            <button className="btn-sec" onClick={() => navigate('/dashboard')} style={{ padding: '14px 36px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 500 }}>
              📊 View Dashboard
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
            {[
              { val: '4', label: 'AI Models', g: 'linear-gradient(135deg,#818cf8,#c084fc)' },
              { val: '98%', label: 'Best Accuracy', g: 'linear-gradient(135deg,#f87171,#fb923c)' },
              { val: '100%', label: 'Kidney Score', g: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
              { val: 'Free', label: 'Always Open', g: 'linear-gradient(135deg,#fbbf24,#f472b6)' }
            ].map((s, i) => (
              <div key={i} style={{ padding: '0 40px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px', background: s.g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '12px', textTransform: 'uppercase' }}>AI Disease Detection</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '8px' }}>
            Choose a{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prediction Model</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)' }}>Each model trained on thousands of real patient records</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px', padding: '0 40px 80px', maxWidth: '900px', margin: '0 auto' }}>
          {cards.map((card, i) => {
            const c = colorMap[card.color];
            return (
              <div key={i} className="card-hover" onClick={() => navigate(card.path)}
                style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', border: `1px solid ${c.border}`, background: `${c.card}` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: `radial-gradient(ellipse at 30% 0%, ${c.glow}, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', background: c.badge, border: `1px solid ${c.border}` }}>{card.icon}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: c.badge, color: c.badgeText, border: `1px solid ${c.border}` }}>{card.badge}</span>
                      <div className="card-arrow" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>→</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>{card.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '24px' }}>{card.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontWeight: 500 }}>Model Accuracy</div>
                      <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${card.accuracy}%`, background: c.acc, borderRadius: '100px' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-1px', color: c.num }}>{card.accuracy}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Glow Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(168,85,247,0.5),transparent)', margin: '0 40px 60px' }} />

        {/* Tech Stack */}
        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '20px', textTransform: 'uppercase' }}>Tech Stack</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '0 40px 80px', flexWrap: 'wrap' }}>
          {techs.map((t, i) => (
            <div key={i} className="tech-tag" style={{ padding: '8px 18px', borderRadius: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{t}</div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;