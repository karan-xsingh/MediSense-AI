import { useLanguage } from '../context/LanguageContext';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const suggestions = [
  "What is diabetes?",
  "Heart disease symptoms?",
  "How to prevent kidney disease?",
  "What does my prediction mean?"
];

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm MediBot 🤖 Your personal healthcare assistant. Ask me anything about diseases, symptoms, or your prediction results!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { language } = useLanguage();

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice not supported on this browser. Try Chrome!');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await axios.post('https://karan18singh.pythonanywhere.com/chat', { message: msg });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .chat-window { animation: slideUp 0.3s cubic-bezier(0.23,1,0.32,1); }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .msg-bot { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .chat-input:focus { outline: none; border-color: rgba(99,102,241,0.6) !important; }
        .send-btn:hover { background: linear-gradient(135deg,#4f46e5,#7c3aed) !important; }
        .suggest-btn:hover { background: rgba(99,102,241,0.2) !important; border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 100px; }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div className="chat-window" style={{
          position: 'fixed', bottom: '90px', right: '24px',
          width: '360px', height: '520px',
          background: '#0d0f1a',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '24px', zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 0 60px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', boxShadow: '0 0 15px rgba(99,102,241,0.5)'
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>MediBot</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#4ade80' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  Online • Healthcare AI
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              color: '#fff', width: '28px', height: '28px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'bot' ? 'msg-bot' : ''} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.role === 'bot' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '8px', flexShrink: 0, alignSelf: 'flex-end' }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)',
                  border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  fontSize: '13px', lineHeight: 1.6, color: '#fff'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggest-btn"
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#a5b4fc',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask about your health...'}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '13px',
                transition: 'border-color 0.2s'
              }}
            />
            <button
              onClick={startVoice}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isListening ? 'linear-gradient(135deg,#ef4444,#f87171)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
                animation: isListening ? 'pulse 1s infinite' : 'none'
              }}
            >
              🎤
            </button>
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: '24px', right: '24px',
        width: '56px', height: '56px', borderRadius: '18px',
        background: 'linear-gradient(135deg,#6366f1,#a855f7)',
        border: 'none', color: '#fff', fontSize: '24px',
        cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 0 30px rgba(99,102,241,0.5)',
        transition: 'all 0.3s',
        transform: open ? 'rotate(0deg)' : 'rotate(0deg)'
      }}>
        {open ? '✕' : '🤖'}
      </button>
    </>
  );
}

export default Chatbot;