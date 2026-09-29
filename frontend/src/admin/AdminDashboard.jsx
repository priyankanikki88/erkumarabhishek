import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        <div className="card">
          <h4>Content</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{data.content.total}</p>
          <p style={{ color: 'var(--text-dim)' }}>{data.content.published} published · {data.content.draft} draft</p>
        </div>
        <div className="card">
          <h4>Products</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{data.products.total}</p>
          <p style={{ color: 'var(--text-dim)' }}>{data.products.published} published</p>
        </div>
        <div className="card">
          <h4>Leads</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{data.leads.total}</p>
          <p style={{ color: 'var(--text-dim)' }}>{data.leads.new_leads} new</p>
        </div>
        <div className="card">
          <h4>Messages</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{data.messages.total}</p>
          <p style={{ color: 'var(--text-dim)' }}>{data.messages.unread} unread</p>
        </div>
      </div>

      <h3>Recent Activity</h3>
      <div className="card">
        <table>
          <thead><tr><th>User</th><th>Action</th><th>Entity</th><th>When</th></tr></thead>
          <tbody>
            {data.recentActivity.map((a, i) => (
              <tr key={i}>
                <td>{a.user_name || 'System'}</td>
                <td>{a.action}</td>
                <td>{a.entity} #{a.entity_id}</td>
                <td>{new Date(a.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
