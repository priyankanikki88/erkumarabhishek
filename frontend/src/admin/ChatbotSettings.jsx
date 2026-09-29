import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ChatbotSettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/chatbot/settings').then(res => setForm(res.data));
  }, []);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await api.put('/chatbot/settings', form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <p>Loading…</p>;

  return (
    <div>
      <h2>AI Chatbot Settings</h2>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="form-field">
          <label><input type="checkbox" checked={!!form.enabled} onChange={e => update('enabled', e.target.checked)} /> Chatbot enabled on public site</label>
        </div>
        <div className="form-field">
          <label>Greeting message</label>
          <textarea value={form.greeting_message || ''} onChange={e => update('greeting_message', e.target.value)} />
        </div>
        <div className="form-field">
          <label>System prompt / instructions (guides AI behavior; knowledge base is added automatically from published content)</label>
          <textarea style={{ minHeight: 140 }} value={form.system_prompt || ''} onChange={e => update('system_prompt', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Model (e.g. gpt-4o-mini)</label>
          <input value={form.model || ''} onChange={e => update('model', e.target.value)} />
        </div>
        <div className="form-field">
          <label><input type="checkbox" checked={!!form.lead_capture_enabled} onChange={e => update('lead_capture_enabled', e.target.checked)} /> Enable lead capture form in chat</label>
        </div>
        <div className="form-field">
          <label><input type="checkbox" checked={!!form.whatsapp_handoff_enabled} onChange={e => update('whatsapp_handoff_enabled', e.target.checked)} /> Enable "Continue on WhatsApp" button</label>
        </div>
        {saved && <p style={{ color: '#00cec9' }}>Saved.</p>}
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </div>
      <p style={{ color: 'var(--text-dim)', marginTop: 16, fontSize: '0.85rem' }}>
        AI replies require an <code>OPENAI_API_KEY</code> set in the backend <code>.env</code> file. Without it, visitors get a fallback message directing them to the contact form or WhatsApp.
      </p>
    </div>
  );
}
