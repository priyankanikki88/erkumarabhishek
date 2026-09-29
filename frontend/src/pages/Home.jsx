import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Home() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    api.get('/content/public/home').then(res => setHero(res.data[0] || null)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="hero">
        <div className="container">
          <span className="badge">Available for new opportunities</span>
          <h1>{hero?.title || 'Er. Kumar Abhishek'}</h1>
          <p>{hero?.excerpt || 'Engineer · Builder · Problem Solver — crafting products, services and ideas that make an impact.'}</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn">View Projects</Link>
            <Link to="/contact" className="btn btn-outline">Get in Touch</Link>
          </div>
        </div>
      </div>

      {hero?.body && (
        <section className="container">
          <div className="card" dangerouslySetInnerHTML={{ __html: hero.body }} />
        </section>
      )}

      <section className="container">
        <div className="section-title"><h2>Explore</h2></div>
        <div className="grid grid-3">
          {[
            ['/projects', 'Projects', 'Selected work and case studies'],
            ['/products', 'Products', 'Browse product catalog'],
            ['/services', 'Services', 'What I offer'],
            ['/experience', 'Experience', 'Career journey so far'],
            ['/articles', 'Articles', 'Writing and insights'],
            ['/contact', 'Contact', "Let's talk"]
          ].map(([to, t, d]) => (
            <Link to={to} key={to} className="card">
              <h3>{t}</h3>
              <p style={{ color: 'var(--text-dim)' }}>{d}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
