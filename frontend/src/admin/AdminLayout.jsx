import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/admin', 'Dashboard', true],
  ['/admin/content', 'Content'],
  ['/admin/products', 'Products'],
  ['/admin/media', 'Media Library'],
  ['/admin/leads', 'Leads (CRM)'],
  ['/admin/messages', 'Messages']
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
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
