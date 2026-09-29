import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/categories/public').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory ? { category: activeCategory } : {};
    api.get('/products/public', { params }).then(res => setProducts(res.data)).finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="container">
      <div className="section-title">
        <h1>Products</h1>
        <p>Explore our product catalog with specifications and brochures.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
        <button className={`btn ${!activeCategory ? '' : 'btn-outline'}`} onClick={() => setActiveCategory('')}>All</button>
        {categories.map(c => (
          <button key={c.id} className={`btn ${activeCategory === c.slug ? '' : 'btn-outline'}`} onClick={() => setActiveCategory(c.slug)}>{c.name}</button>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading…</p>}
      {!loading && products.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No products found.</p>}

      <div className="grid grid-3">
        {products.map(p => (
          <article className="card" key={p.id}>
            {p.images?.[0] && <img src={p.images[0].url} alt={p.name} style={{ borderRadius: 12, marginBottom: 16, height: 180, objectFit: 'cover' }} />}
            <h3>{p.name}</h3>
            {p.category_name && <span className="badge">{p.category_name}</span>}
            <p style={{ color: 'var(--text-dim)', marginTop: 10 }}>{p.description?.slice(0, 140)}</p>
            {p.price && <p><strong>₹{p.price}</strong></p>}
            {p.specifications && (
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                {Object.entries(p.specifications).slice(0, 4).map(([k, v]) => <li key={k}>{k}: {String(v)}</li>)}
              </ul>
            )}
            {p.brochures?.[0] && <a className="btn btn-outline" href={p.brochures[0].url} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>Download Brochure</a>}
          </article>
        ))}
      </div>
    </section>
  );
}
