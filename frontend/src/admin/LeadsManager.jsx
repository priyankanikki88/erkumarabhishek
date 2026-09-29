import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';
import api from '../api/client';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const FUNNEL_ORDER = ['new', 'contacted', 'qualified', 'converted'];
const COLORS = { new: '#6c5ce7', contacted: '#0984e3', qualified: '#fdcb6e', converted: '#00cec9' };

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [funnel, setFunnel] = useState([]);

  function load() {
    api.get('/leads', { params: { status: statusFilter || undefined } }).then(res => setLeads(res.data));
    api.get('/leads/funnel').then(res => {
      const byStatus = Object.fromEntries(res.data.map(r => [r.status, r.count]));
      setFunnel(FUNNEL_ORDER.map(s => ({ name: s, value: byStatus[s] || 0, fill: COLORS[s] })));
    });
  }
  useEffect(load, [statusFilter]);

  async function updateStatus(id, status) {
    await api.patch(`/leads/${id}`, { status });
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>Leads (CRM)</h2>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4>Conversion Funnel</h4>
        <ResponsiveContainer width="100%" height={220}>
          <FunnelChart>
            <Tooltip contentStyle={{ background: '#10182b', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Funnel dataKey="value" data={funnel} isAnimationActive>
              <LabelList position="right" fill="#eef1fb" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Contact</th><th>Requirement</th><th>Source</th><th>Status</th><th>Received</th><th></th></tr></thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id}>
                <td>{l.name || '—'}</td>
                <td>{l.email}<br />{l.phone}</td>
                <td style={{ maxWidth: 260 }}>{l.requirement?.slice(0, 100)}</td>
                <td>{l.source}</td>
                <td>
                  <select value={l.status} onChange={e => updateStatus(l.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(l.created_at).toLocaleDateString()}</td>
                <td><Link to={`/admin/leads/${l.id}`} className="btn btn-outline" style={{ padding: '6px 14px' }}>Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
