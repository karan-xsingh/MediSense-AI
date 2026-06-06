import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const cardData = [
  { icon: "🩺", path: "/diabetes", accuracy: 72, color: "blue" },
  { icon: "❤️", path: "/heart", accuracy: 98, color: "red" },
  { icon: "🫘", path: "/kidney", accuracy: 100, color: "green" },
  { icon: "🔬", path: "/xray", accuracy: 95, color: "purple" }
];

const techs = [
  "⚛️ React", "🐍 Flask", "🤖 TensorFlow",
  "📊 Scikit-learn", "🧠 Random Forest", "🔬 CNN"
];

const colorMap = {
  blue:   { border: 'rgba(99,102,241,0.3)',  glow: 'rgba(99,102,241,0.15)',  acc: 'linear-gradient(90deg,#6366f1,#818cf8)', num: '#818cf8', bg: '#1e1b4b' },
  red:    { border: 'rgba(239,68,68,0.3)',   glow: 'rgba(239,68,68,0.15)',   acc: 'linear-gradient(90deg,#ef4444,#f87171)', num: '#f87171', bg: '#1f1215' },
  green:  { border: 'rgba(34,197,94,0.3)',   glow: 'rgba(34,197,94,0.15)',   acc: 'linear-gradient(90deg,#22c55e,#4ade80)', num: '#4ade80', bg: '#052e16' },
  purple: { border: 'rgba(168,85,247,0.3)',  glow: 'rgba(168,85,247,0.15)',  acc: 'linear-gradient(90deg,#a855f7,#c084fc)', num: '#c084fc', bg: '#1a0533' }
};

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: '#03040a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card-hover { transition: all 0.3s ease; cursor: pointer; }
        .card-hover:hover { transform: translateY(-6px); }
        .btn-main { transition: all 0.3s; border: none; cursor: pointer; }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(99,102,241,0.6) !important; }
        .btn-sec { transition: all 0.3s; cursor: pointer; }
        .btn-sec:hover { background: rgba(255,255,255,0.1) !important; }
        .tech-tag:hover { border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; }
        .menu-item:hover { color: #a5b4fc !important; }
        .lang-btn:hover { background: rgba(99,102,241,0.2) !important; }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 50px 50px; pointer-events: none;
        }
        .cards-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 14px; padding: 0 16px 60px;
          max-width: 900px; margin: 0 auto;
        }
        @media (min-width: 640px) { .cards-grid { grid-template-columns: 1fr 1fr; padding: 0 24px 60px; } }
        @media (min-width: 1024px) { .cards-grid { grid-template-columns: 1fr 1fr; padding: 0 40px 80px; gap: 16px; } }
        .stats-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; max-width: 600px; margin: 0 auto 60px;
        }
        @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(4, 1fr); max-width: 800px; } }
        .hero-title { font-size: 28px; font-weight: 900; line-height: 1.1; letter-spacing: -1px; margin-bottom: 16px; }
        @media (min-width: 640px) { .hero-title { font-size: 48px; } }
        @media (min-width: 1024px) { .hero-title { font-size: 68px; letter-spacing: -3px; } }
        .hero-pad { padding: 60px 16px 40px; }
        @media (min-width: 640px) { .hero-pad { padding: 80px 24px 50px; } }
        @media (min-width: 1024px) { .hero-pad { padding: 100px 40px 60px; } }
        .cta-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 48px; align-items: center; }
        @media (min-width: 480px) { .cta-row { flex-direction: row; justify-content: center; } }
        .cta-btn { width: 100%; max-width: 280px; padding: 14px 24px; border-radius: 14px; font-size: 15px; font-weight: 700; text-align: center; }
        @media (min-width: 480px) { .cta-btn { width: auto; max-width: none; } }
        .tech-row { display: flex; justify-content: center; gap: 8px; padding: 0 16px 60px; flex-wrap: wrap; }
        .section-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        @media (min-width: 640px) { .section-title { font-size: 32px; } }
      `}</style>

      <div className="grid-bg" />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Navbar */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(3,4,10,0.85)',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', boxShadow: '0 0 15px rgba(99,102,241,0.5)'
            }}>🏥</div>
            <span style={{
              fontSize: '15px', fontWeight: 800,
              background: 'linear-gradient(90deg,#a5b4fc,#e879f9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{t.appName}</span>
          </div>

          {/* Right side buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Language Toggle */}
            <button className="lang-btn" onClick={toggleLanguage} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: '6px 10px',
              borderRadius: '10px', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, transition: 'all 0.2s'
            }}>
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
            </button>

            {/* Dashboard */}
            <button className="btn-main" onClick={() => navigate('/dashboard')} style={{
              padding: '7px 12px', borderRadius: '100px',
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              color: '#fff', fontSize: '11px', fontWeight: 600,
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>📊 {t.dashboardBtn.replace('📊 ', '')}</button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', width: '34px', height: '34px',
              borderRadius: '10px', cursor: 'pointer', fontSize: '15px'
            }}>☰</button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'fixed', top: '61px', left: 0, right: 0,
            background: 'rgba(10,10,20,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            zIndex: 99, padding: '16px'
          }}>
            {['🏠 Home', '🤖 Models', '📊 Dashboard', 'ℹ️ About'].map(item => (
              <div key={item} className="menu-item" onClick={() => {
                setMenuOpen(false);
                if (item.includes('Dashboard')) navigate('/dashboard');
              }} style={{
                padding: '14px 16px', fontSize: '15px', fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', transition: 'color 0.2s'
              }}>{item}</div>
            ))}
          </div>
        )}

        {/* Hero */}
        <div className="hero-pad" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 5px 5px 14px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '11px', color: '#a5b4fc', marginBottom: '24px'
          }}>
            <span>{t.tagline}</span>
            <span style={{
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              borderRadius: '100px', padding: '3px 10px',
              fontSize: '10px', color: '#fff', fontWeight: 600
            }}>New: X-Ray AI</span>
          </div>

          <h1 className="hero-title">
            <span style={{ color: '#fff' }}>{t.hero1}<br /></span>
            <span style={{
              background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 40%,#38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{t.hero2}</span>
          </h1>

          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.45)',
            maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.8
          }}>
            {t.subtitle}
          </p>

          <div className="cta-row">
            <button className="btn-main cta-btn" onClick={() => navigate('/diabetes')} style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', boxShadow: '0 0 30px rgba(99,102,241,0.45)'
            }}>
              {t.analyzeBtn}
            </button>
            <button className="btn-sec cta-btn" onClick={() => navigate('/dashboard')} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)'
            }}>
              {t.dashboardBtn}
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { val: '4', label: t.aiModels, g: 'linear-gradient(135deg,#818cf8,#c084fc)' },
              { val: '98%', label: t.bestAccuracy, g: 'linear-gradient(135deg,#f87171,#fb923c)' },
              { val: '100%', label: t.kidneyScore, g: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
              { val: 'Free', label: t.alwaysOpen, g: 'linear-gradient(135deg,#fbbf24,#f472b6)' }
            ].map((s, i) => (
              <div key={i} style={{
                padding: '20px 10px', textAlign: 'center',
                borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none'
              }}>
                <div style={{
                  fontSize: '28px', fontWeight: 900, letterSpacing: '-1px',
                  background: s.g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 16px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '3px',
            color: 'rgba(255,255,255,0.25)', marginBottom: '10px', textTransform: 'uppercase'
          }}>{t.aiDetection}</div>
          <h2 className="section-title">
            {t.chooseModel}{' '}
            <span style={{
              background: 'linear-gradient(135deg,#818cf8,#c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{t.predictionModel}</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {t.trainedOn}
          </p>
        </div>

        {/* Cards */}
        <div className="cards-grid">
          {cardData.map((card, i) => {
            const c = colorMap[card.color];
            const cardText = t.cards[i];
            return (
              <div key={i} className="card-hover" onClick={() => navigate(card.path)} style={{
                borderRadius: '20px', padding: '24px',
                position: 'relative', overflow: 'hidden',
                border: `1px solid ${c.border}`, background: c.bg
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
                  background: `radial-gradient(ellipse at 30% 0%, ${c.glow}, transparent 70%)`,
                  pointerEvents: 'none'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px', background: c.glow, border: `1px solid ${c.border}`
                    }}>{card.icon}</div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '11px',
                      fontWeight: 700, background: c.glow, color: c.num, border: `1px solid ${c.border}`
                    }}>{card.accuracy}% Acc</div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>{cardText.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '16px' }}>{cardText.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${card.accuracy}%`, background: c.acc, borderRadius: '100px' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: c.num }}>{card.accuracy}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(168,85,247,0.4),transparent)',
          margin: '0 16px 40px'
        }} />

        {/* Tech Stack */}
        <div style={{
          textAlign: 'center', fontSize: '10px', fontWeight: 600,
          letterSpacing: '3px', color: 'rgba(255,255,255,0.25)',
          marginBottom: '16px', textTransform: 'uppercase'
        }}>{t.techStack}</div>
        <div className="tech-row">
          {techs.map((tech, i) => (
            <div key={i} className="tech-tag" style={{
              padding: '6px 14px', borderRadius: '100px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '11px', color: 'rgba(255,255,255,0.4)',
              fontWeight: 500, cursor: 'default', transition: 'all 0.2s'
            }}>{tech}</div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;