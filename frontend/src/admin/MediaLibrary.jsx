import { useEffect, useState } from 'react';
import api from '../api/client';

export default function MediaLibrary() {
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
      e.target.value = '';
    }
  }

  async function remove(id) {
    if (!confirm('Delete this media file?')) return;
    await api.delete(`/media/${id}`);
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>Media Library</h2>
        <label className="btn" style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : '+ Upload File'}
          <input type="file" hidden onChange={handleUpload} accept="image/*,video/*,application/pdf" />
        </label>
      </div>
      <div className="grid grid-3">
        {media.map(m => (
          <div key={m.id} className="card">
            {m.kind === 'image' ? <img src={m.url} alt="" style={{ height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} /> : <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{m.kind.toUpperCase()}</div>}
            <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{m.filename}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{(m.size_bytes / 1024).toFixed(1)} KB</p>
            <button className="btn btn-outline" style={{ color: '#ff7675', width: '100%' }} onClick={() => remove(m.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
