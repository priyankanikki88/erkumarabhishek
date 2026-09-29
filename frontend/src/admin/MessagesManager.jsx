import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);

  function load() {
    api.get('/contact').then(res => setMessages(res.data));
  }
  useEffect(load, []);

  async function markRead(id) {
    await api.patch(`/contact/${id}/status`, { status: 'read' });
    load();
  }

  return (
    <div>
      <h2>Contact Messages</h2>
      <div className="grid grid-2">
        {messages.map(m => (
          <div key={m.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{m.name}</strong>
              <span className={`status-pill status-${m.status === 'new' ? 'draft' : 'published'}`}>{m.status}</span>
            </div>
            <p style={{ color: 'var(--text-dim)' }}>{m.email} {m.phone && `· ${m.phone}`}</p>
            {m.subject && <p><strong>{m.subject}</strong></p>}
            <p>{m.message}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(m.created_at).toLocaleString()}</p>
            {m.status === 'new' && <button className="btn btn-outline" onClick={() => markRead(m.id)}>Mark as Read</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
