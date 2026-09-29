import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function ProductManager() {
  const [products, setProducts] = useState([]);

  function load() {
    api.get('/products').then(res => setProducts(res.data));
  }
  useEffect(load, []);

  async function setStatus(id, status) {
    await api.patch(`/products/${id}/status`, { status });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>Products</h2>
        <Link to="/admin/products/new" className="btn">+ New Product</Link>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Status</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category_name || '—'}</td>
                <td><span className={`status-pill status-${p.status}`}>{p.status}</span></td>
                <td>{p.price ? `₹${p.price}` : '—'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/admin/products/${p.id}`} className="btn btn-outline" style={{ padding: '6px 14px' }}>Edit</Link>
                  {p.status !== 'published' && <button className="btn" style={{ padding: '6px 14px' }} onClick={() => setStatus(p.id, 'published')}>Publish</button>}
                  {p.status === 'published' && <button className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => setStatus(p.id, 'unpublished')}>Unpublish</button>}
                  <button className="btn btn-outline" style={{ padding: '6px 14px', color: '#ff7675' }} onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
