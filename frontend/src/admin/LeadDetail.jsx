import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const ACTIVITY_TYPES = ['note', 'call', 'email', 'follow_up'];

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ type: 'note', notes: '', follow_up_date: '' });

  function load() {
    api.get(`/leads/${id}`).then(res => setLead(res.data));
    api.get(`/leads/${id}/activities`).then(res => setActivities(res.data));
  }
  useEffect(load, [id]);

  async function updateStatus(status) {
    await api.patch(`/leads/${id}`, { status });
    load();
  }

  async function addActivity(e) {
    e.preventDefault();
    await api.post(`/leads/${id}/activities`, form);
    setForm({ type: 'note', notes: '', follow_up_date: '' });
    load();
  }

  if (!lead) return <p>Loading…</p>;

  return (
    <div>
      <Link to="/admin/leads" className="btn btn-outline" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to Leads</Link>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <h3>{lead.name || 'Unnamed Lead'}</h3>
          <p>{lead.email} {lead.phone && `· ${lead.phone}`}</p>
          <p>{lead.location}</p>
          <p style={{ color: 'var(--text-dim)' }}>{lead.requirement}</p>
          <p><span className="badge">{lead.source}</span></p>
          <div className="form-field">
            <label>Status</label>
            <select value={lead.status} onChange={e => updateStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Received {new Date(lead.created_at).toLocaleString()}</p>
        </div>

        <div className="card">
          <h4>Add Activity / Follow-up</h4>
          <form onSubmit={addActivity}>
            <div className="form-field">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            {form.type === 'follow_up' && (
              <div className="form-field">
                <label>Follow-up date</label>
                <input type="datetime-local" value={form.follow_up_date} onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))} />
              </div>
            )}
            <button className="btn" type="submit">Add</button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h4>Activity Timeline</h4>
        {activities.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No activity yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {activities.map(a => (
            <li key={a.id} style={{ borderBottom: '1px solid var(--surface-border)', padding: '10px 0' }}>
              <span className="badge">{a.type}</span> <strong>{a.created_by_name || 'System'}</strong>
              <p>{a.notes}</p>
              {a.follow_up_date && <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Follow up: {new Date(a.follow_up_date).toLocaleString()}</p>}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(a.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
