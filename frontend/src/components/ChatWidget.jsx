import { useEffect, useRef, useState } from 'react';
import api from '../api/client';
import { getVisitorId, getSessionId } from '../utils/visitor';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '91XXXXXXXXXX';

export default function ChatWidget() {
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', location: '', requirement: '', consent: false });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get('/chatbot/settings/public').then(res => setSettings(res.data)).catch(() => setSettings({ enabled: false }));
  }, []);

  useEffect(() => {
    if (open && settings?.enabled && messages.length === 0) {
      setMessages([{ role: 'assistant', content: settings.greeting_message }]);
    }
  }, [open, settings]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!settings || !settings.enabled) return null;

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', content: text }]);
    setSending(true);

    try {
      const res = await api.post('/chatbot/message', {
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        message: text
      });
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please try again or use WhatsApp.' }]);
    } finally {
      setSending(false);
    }
  }

  async function submitLead(e) {
    e.preventDefault();
    if (!leadForm.consent) return;
    await api.post('/chatbot/lead', {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      ...leadForm
    });
    setLeadSubmitted(true);
    setShowLeadForm(false);
    setMessages(m => [...m, { role: 'assistant', content: `Thanks ${leadForm.name}! Our team will reach out soon.` }]);
  }

  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const waMessage = encodeURIComponent(lastUserMessage ? `Hi, I was chatting on your website: "${lastUserMessage}"` : 'Hi, I visited your portfolio website.');

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 96, zIndex: 100 }}>
      {open && (
        <div className="card" style={{ width: 340, height: 460, display: 'flex', flexDirection: 'column', padding: 0, marginBottom: 12 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
            <strong>AI Assistant</strong>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>×</button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--primary)' : 'var(--surface)',
                border: m.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                padding: '8px 12px', borderRadius: 12, maxWidth: '85%', fontSize: '0.88rem'
              }}>
                {m.content}
              </div>
            ))}
            {sending && <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Typing…</div>}
          </div>

          {settings.lead_capture_enabled && !leadSubmitted && (
            <div style={{ padding: '0 16px 8px' }}>
              {!showLeadForm ? (
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }} onClick={() => setShowLeadForm(true)}>
                  Share your details for a callback
                </button>
              ) : (
                <form onSubmit={submitLead} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input required placeholder="Name" value={leadForm.name} onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }} />
                  <input placeholder="Phone" value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }} />
                  <input placeholder="Email" type="email" value={leadForm.email} onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }} />
                  <input placeholder="Location" value={leadForm.location} onChange={e => setLeadForm(f => ({ ...f, location: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }} />
                  <textarea placeholder="What do you need?" value={leadForm.requirement} onChange={e => setLeadForm(f => ({ ...f, requirement: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem', minHeight: 50 }} />
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="checkbox" required checked={leadForm.consent} onChange={e => setLeadForm(f => ({ ...f, consent: e.target.checked }))} />
                    I consent to being contacted about my inquiry.
                  </label>
                  <button className="btn" style={{ padding: 8, fontSize: '0.85rem' }} type="submit">Submit</button>
                </form>
              )}
            </div>
          )}

          {settings.whatsapp_handoff_enabled && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', padding: 10, background: '#25D366', color: 'white', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Continue on WhatsApp
            </a>
          )}

          <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid var(--surface-border)' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…"
              style={{ flex: 1, background: 'transparent', border: 'none', padding: 12, color: 'var(--text)', fontSize: '0.85rem' }}
            />
            <button type="submit" disabled={sending} style={{ background: 'none', border: 'none', color: 'var(--primary-2)', padding: '0 16px', cursor: 'pointer' }}>Send</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 60, height: 60, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-2))',
          color: 'white', fontSize: '1.6rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(108,92,231,0.5)'
        }}
        aria-label="Open AI chat"
      >
        💬
      </button>
    </div>
  );
}
