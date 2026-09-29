import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/client';

const COLORS = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#0984e3', '#e17055'];

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics/summary', { params: { range } }).then(res => setData(res.data));
  }, [range]);

  async function exportCsv() {
    const res = await api.get('/analytics/export.csv', { params: { range }, responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-topbar">
        <h2>Analytics</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={range} onChange={e => setRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="12m">Last 12 months</option>
            <option value="all">All time</option>
          </select>
          <button className="btn btn-outline" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        <div className="card"><h4>Pageviews</h4><p style={{ fontSize: '2rem', margin: 0 }}>{data.totals.pageviews}</p></div>
        <div className="card"><h4>Unique Visitors</h4><p style={{ fontSize: '2rem', margin: 0 }}>{data.totals.unique_visitors}</p></div>
        <div className="card"><h4>Sessions</h4><p style={{ fontSize: '2rem', margin: 0 }}>{data.totals.sessions}</p></div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4>Traffic over time</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={range === '12m' ? data.monthly : data.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey={range === '12m' ? 'month' : 'day'} stroke="#a3acc9" fontSize={12} />
            <YAxis stroke="#a3acc9" fontSize={12} />
            <Tooltip contentStyle={{ background: '#10182b', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Line type="monotone" dataKey="pageviews" stroke="#6c5ce7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="visitors" stroke="#00cec9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h4>Top Pages</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.topPages} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" stroke="#a3acc9" fontSize={12} />
              <YAxis type="category" dataKey="path" stroke="#a3acc9" fontSize={11} width={140} />
              <Tooltip contentStyle={{ background: '#10182b', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="views" fill="#6c5ce7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4>Devices</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.devices} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={90} label>
                {data.devices.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: '#10182b', border: '1px solid rgba(255,255,255,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <h4>Traffic Sources</h4>
          <table>
            <thead><tr><th>Source</th><th>Visits</th></tr></thead>
            <tbody>{data.sources.map((s, i) => <tr key={i}><td>{s.source}</td><td>{s.count}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="card">
          <h4>Browsers</h4>
          <table>
            <thead><tr><th>Browser</th><th>Visits</th></tr></thead>
            <tbody>{data.browsers.map((b, i) => <tr key={i}><td>{b.browser}</td><td>{b.count}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
