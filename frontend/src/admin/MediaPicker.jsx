import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MediaPicker({ onSelect, onClose }) {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/media').then(res => setMedia(res.data));
  }
  useEffect(load, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await api.post('/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, padding: 40, overflowY: 'auto' }}>
      <div className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="admin-topbar">
          <h3>Media Library</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" hidden onChange={handleUpload} accept="image/*,video/*,application/pdf" />
            </label>
            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="grid grid-3">
          {media.map(m => (
            <div key={m.id} className="card" style={{ cursor: 'pointer', padding: 10 }} onClick={() => onSelect(m.url)}>
              {m.kind === 'image' ? <img src={m.url} alt="" style={{ height: 100, objectFit: 'cover', borderRadius: 8 }} /> : <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.kind.toUpperCase()}</div>}
              <p style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{m.filename}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
