import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Conversations() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get('/chatbot/conversations').then(res => setList(res.data));
  }, []);

  async function open(conv) {
    setSelected(conv);
    const res = await api.get(`/chatbot/conversations/${conv.id}`);
    setMessages(res.data);
  }

  return (
    <div>
      <h2>AI Conversations</h2>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr', alignItems: 'start' }}>
        <div className="card" style={{ maxHeight: 600, overflowY: 'auto' }}>
          {list.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No conversations yet.</p>}
          {list.map(c => (
            <div key={c.id} onClick={() => open(c)} style={{ padding: 10, borderBottom: '1px solid var(--surface-border)', cursor: 'pointer', background: selected?.id === c.id ? 'var(--surface)' : 'transparent' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.lead_name || 'Anonymous visitor'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{c.last_message?.slice(0, 60)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(c.last_message_at).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ minHeight: 300 }}>
          {!selected && <p style={{ color: 'var(--text-dim)' }}>Select a conversation to view transcript.</p>}
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(m => (
                <div key={m.id} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--surface)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                  padding: '8px 12px', borderRadius: 12, maxWidth: '80%', fontSize: '0.85rem'
                }}>
                  {m.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
