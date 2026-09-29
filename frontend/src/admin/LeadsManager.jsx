import { useEffect, useState } from 'react';
import api from '../api/client';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    api.get('/leads', { params: { status: statusFilter || undefined } }).then(res => setLeads(res.data));
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
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Contact</th><th>Requirement</th><th>Source</th><th>Status</th><th>Received</th></tr></thead>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
