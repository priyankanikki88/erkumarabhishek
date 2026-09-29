import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ notifications: [], unread: 0 });
  const ref = useRef(null);

  function load() {
    api.get('/notifications').then(res => setData(res.data)).catch(() => {});
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function markAllRead() {
    await api.patch('/notifications/read-all');
    load();
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn btn-outline" onClick={() => setOpen(o => !o)} style={{ position: 'relative' }}>
        🔔
        {data.unread > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff7675', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data.unread}
          </span>
        )}
      </button>
      {open && (
        <div className="card" style={{ position: 'absolute', right: 0, top: 46, width: 320, maxHeight: 400, overflowY: 'auto', zIndex: 50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong>Notifications</strong>
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary-2)', fontSize: '0.8rem', cursor: 'pointer' }}>Mark all read</button>
          </div>
          {data.notifications.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No notifications yet.</p>}
          {data.notifications.map(n => (
            <Link key={n.id} to={n.link || '#'} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', opacity: n.is_read ? 0.6 : 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{n.body}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(n.created_at).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
