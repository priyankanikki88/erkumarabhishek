import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const links = [
  ['/admin', 'Dashboard', true],
  ['/admin/content', 'Content'],
  ['/admin/products', 'Products'],
  ['/admin/media', 'Media Library'],
  ['/admin/leads', 'Leads (CRM)'],
  ['/admin/messages', 'Messages'],
  ['/admin/analytics', 'Analytics'],
  ['/admin/chatbot', 'AI Chatbot Settings'],
  ['/admin/conversations', 'AI Conversations'],
  ['/admin/audit', 'Audit Log']
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: 20 }}>CMS Admin</h3>
        {links.map(([to, label, end]) => (
          <NavLink key={to} to={to} end={!!end} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
        ))}
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div>Signed in as <strong>{user?.name}</strong> ({user?.role})</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NotificationBell />
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
