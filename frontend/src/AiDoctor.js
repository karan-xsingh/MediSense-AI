import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://karan18singh.pythonanywhere.com';

function AiDoctor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👨‍⚕️ **Hello! I'm Dr. MediSense AI**\n\nI'm powered by AMD MI300X and can help you with:\n\n• 🔍 Understanding your symptoms\n• 💊 Medicine information\n• 🥗 Diet & lifestyle advice\n• ⚠️ When to see a real doctor\n• 💬 Hindi & English support\n\n**Tell me your symptoms or health concern!**`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showReminder, setShowReminder] = useState(false);
  const [reminder, setReminder] = useState({
    phone: '', medicine: '', time: '', repeat: 'daily', name: ''
  });
  const [reminderSuccess, setReminderSuccess] = useState(null);
  const [reminders, setReminders] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.slice(-6).map(m => ({
        role: m.role, content: m.content
      }));

      const resp = await axios.post(`${API_URL}/doctor/chat`, {
        question: input,
        language,
        chat_history: history.slice(0, -1)
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resp.data.response
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error. Please check if backend is running.'
      }]);
    }
    setLoading(false);
  };

  const addReminder = async () => {
    try {
      const resp = await axios.post(`${API_URL}/reminders/add`, {
        phone: reminder.phone,
        medicine: reminder.medicine,
        patient_name: reminder.name,
        reminder_time: reminder.time,
        repeat: reminder.repeat
      });
      setReminderSuccess(resp.data);
      setReminders(prev => [...prev, resp.data.reminder]);
      setReminder({ phone: '', medicine: '', time: '', repeat: 'daily', name: '' });
    } catch (err) {
      alert('Error setting reminder: ' + err.message);
    }
  };

  const quickQuestions = [
    "I have headache and fever, what should I do?",
    "What foods should a diabetic patient avoid?",
    "How to control high blood pressure naturally?",
    "What are symptoms of kidney disease?",
    "मुझे सीने में दर्द है, क्या करूं?",
    "बुखार और खांसी के लिए घरेलू उपाय बताएं"
  ];

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#03040a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '14px' }}>
            ← Back
          </button>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
          }}>👨‍⚕️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px' }}>Dr. MediSense AI</div>
            <div style={{ fontSize: '11px', color: '#a5b4fc' }}>
              🔴 AMD MI300X • LLaMA 3.3 70B • Always Available
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            style={{
              background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
              color: '#a5b4fc', padding: '6px 14px', borderRadius: '20px',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600
            }}>
            {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </button>
          <button onClick={() => setShowReminder(!showReminder)}
            style={{
              background: showReminder ? '#7c3aed' : 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#fff', padding: '6px 14px', borderRadius: '20px',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600
            }}>
            💊 Medicine Reminders {reminders.length > 0 && `(${reminders.length})`}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 77px)' }}>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Quick Questions */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0
          }}>
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => setInput(q)}
                style={{
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  color: '#a5b4fc', padding: '6px 12px', borderRadius: '20px',
                  cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap', flexShrink: 0
                }}>
                {q.length > 30 ? q.substring(0, 30) + '...' : q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', marginRight: '10px', alignSelf: 'flex-start'
                  }}>👨‍⚕️</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                    : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 16px', borderRadius: '16px',
                  fontSize: '13px', lineHeight: 1.7, color: '#fff'
                }}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                {msg.role === 'user' && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #2563eb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', marginLeft: '10px', alignSelf: 'flex-start'
                  }}>👤</div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                }}>👨‍⚕️</div>
                <div style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 16px', borderRadius: '16px', fontSize: '13px', color: '#a5b4fc'
                }}>
                  🔴 AMD MI300X Processing... ⚡
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder={language === 'en'
                ? "Describe your symptoms or ask a health question..."
                : "अपने लक्षण बताएं या स्वास्थ्य प्रश्न पूछें..."}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '12px 16px',
                color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none', borderRadius: '12px', padding: '12px 20px',
                color: '#fff', cursor: 'pointer', fontSize: '18px',
                opacity: loading || !input.trim() ? 0.5 : 1
              }}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>

        {/* Medicine Reminder Panel */}
        {showReminder && (
          <div style={{
            width: '320px', borderLeft: '1px solid rgba(124,58,237,0.3)',
            background: 'rgba(124,58,237,0.05)', padding: '20px',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#c084fc', marginBottom: '20px', fontSize: '16px', fontWeight: 700 }}>
              💊 Medicine Reminders
            </h3>

            {/* Add Reminder Form */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
              padding: '16px', marginBottom: '20px',
              border: '1px solid rgba(124,58,237,0.2)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc', marginBottom: '12px' }}>
                ➕ Add New Reminder
              </div>

              {[
                { key: 'name', label: 'Patient Name', placeholder: 'e.g. Karan', type: 'text' },
                { key: 'phone', label: 'WhatsApp Number', placeholder: '+91XXXXXXXXXX', type: 'text' },
                { key: 'medicine', label: 'Medicine Name', placeholder: 'e.g. Metformin 500mg', type: 'text' },
                { key: 'time', label: 'Reminder Time', placeholder: '', type: 'time' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '4px' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={reminder[field.key]}
                    onChange={e => setReminder({ ...reminder, [field.key]: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '8px 10px',
                      color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '4px' }}>
                  Repeat
                </label>
                <select
                  value={reminder.repeat}
                  onChange={e => setReminder({ ...reminder, repeat: e.target.value })}
                  style={{
                    width: '100%', background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '8px 10px',
                    color: '#fff', fontSize: '12px', outline: 'none'
                  }}>
                  <option value="daily">🔄 Daily</option>
                  <option value="once">1️⃣ Once Only</option>
                </select>
              </div>

              <button onClick={addReminder}
                style={{
                  width: '100%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  border: 'none', borderRadius: '8px', padding: '10px',
                  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}>
                ⏰ Set Reminder
              </button>

              {reminderSuccess && (
                <div style={{
                  marginTop: '10px', background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '8px', padding: '8px 10px',
                  fontSize: '11px', color: '#4ade80'
                }}>
                  ✅ Reminder set! WhatsApp alert will be sent.
                </div>
              )}
            </div>

            {/* Active Reminders */}
            {reminders.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc', marginBottom: '12px' }}>
                  ⏰ Active Reminders ({reminders.length})
                </div>
                {reminders.map((r, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                    padding: '12px', marginBottom: '8px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>💊 {r.medicine}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      👤 {r.patient_name} • ⏰ {r.time} • 🔄 {r.repeat}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div style={{
              marginTop: '16px', background: 'rgba(99,102,241,0.1)',
              borderRadius: '10px', padding: '12px',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6
            }}>
              📱 Reminders are sent via WhatsApp to the registered number at the set time daily.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiDoctor;