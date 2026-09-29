import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const TYPES = ['home', 'about', 'journey', 'education', 'experience', 'skills', 'certifications', 'project', 'service', 'article', 'blog', 'marketing', 'gallery'];

export default function ContentManager() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    api.get('/content', { params: { type: typeFilter || undefined, status: statusFilter || undefined } }).then(res => setItems(res.data));
  }

  useEffect(load, [typeFilter, statusFilter]);

  async function setStatus(id, status) {
    await api.patch(`/content/${id}/status`, { status });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this content item?')) return;
    await api.delete(`/content/${id}`);
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>Content</h2>
        <Link to="/admin/content/new" className="btn">+ New Content</Link>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td><span className={`status-pill status-${item.status}`}>{item.status}</span></td>
                <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/admin/content/${item.id}`} className="btn btn-outline" style={{ padding: '6px 14px' }}>Edit</Link>
                  {item.status !== 'published' && <button className="btn" style={{ padding: '6px 14px' }} onClick={() => setStatus(item.id, 'published')}>Publish</button>}
                  {item.status === 'published' && <button className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => setStatus(item.id, 'unpublished')}>Unpublish</button>}
                  <button className="btn btn-outline" style={{ padding: '6px 14px', color: '#ff7675' }} onClick={() => remove(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
