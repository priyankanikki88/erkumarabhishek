import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/audit').then(res => setLogs(res.data));
  }, []);

  return (
    <div>
      <h2>Audit Log</h2>
      <div className="card">
        <table>
          <thead><tr><th>User</th><th>Action</th><th>Entity</th><th>IP</th><th>When</th></tr></thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.user_name || 'System'}</td>
                <td>{l.action}</td>
                <td>{l.entity} {l.entity_id ? `#${l.entity_id}` : ''}</td>
                <td>{l.ip_address}</td>
                <td>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
