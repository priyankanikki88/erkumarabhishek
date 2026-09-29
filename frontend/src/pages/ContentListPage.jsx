import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ContentListPage({ type, title, subtitle }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/content/public/${type}`)
      .then(res => setItems(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="container">
      <div className="section-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading…</p>}
      {!loading && items.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Content coming soon.</p>}

      <div className="grid grid-2">
        {items.map(item => (
          <article className="card" key={item.id}>
            {item.featured_image && <img src={item.featured_image} alt={item.title} style={{ borderRadius: 12, marginBottom: 16 }} />}
            <h3>{item.title}</h3>
            {item.excerpt && <p style={{ color: 'var(--text-dim)' }}>{item.excerpt}</p>}
            {item.body && <div dangerouslySetInnerHTML={{ __html: item.body }} />}
            {item.meta && Object.keys(item.meta).length > 0 && (
              <ul style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                {Object.entries(item.meta).map(([k, v]) => <li key={k}><strong>{k}:</strong> {String(v)}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
