import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api/client';
import MediaPicker from './MediaPicker';

const TYPES = ['home', 'about', 'journey', 'education', 'experience', 'skills', 'certifications', 'project', 'service', 'article', 'blog', 'marketing', 'gallery'];

const empty = {
  type: 'about', title: '', slug: '', excerpt: '', body: '', featured_image: '',
  status: 'draft', seo_title: '', seo_description: '', seo_keywords: '', order_index: 0
};

export default function ContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState(empty);
  const [versions, setVersions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/content/${id}`).then(res => setForm({ ...empty, ...res.data, meta: res.data.meta || {} }));
      api.get(`/content/${id}/versions`).then(res => setVersions(res.data));
    }
  }, [id]);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function save(status) {
    setSaving(true);
    const payload = { ...form, status: status || form.status };
    try {
      if (isNew) {
        const res = await api.post('/content', payload);
        navigate(`/admin/content/${res.data.id}`);
      } else {
        await api.put(`/content/${id}`, payload);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>{isNew ? 'New Content' : `Edit: ${form.title}`}</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowPreview(true)}>Preview</button>
          <button className="btn btn-outline" onClick={() => save('draft')} disabled={saving}>Save Draft</button>
          <button className="btn" onClick={() => save('published')} disabled={saving}>Publish</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="form-field">
            <label>Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Title</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Slug (optional, auto-generated from title)</label>
            <input value={form.slug} onChange={e => update('slug', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Excerpt</label>
            <textarea value={form.excerpt || ''} onChange={e => update('excerpt', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Featured Image</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {form.featured_image && <img src={form.featured_image} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />}
              <button type="button" className="btn btn-outline" onClick={() => setShowMediaPicker(true)}>Choose from Media Library</button>
            </div>
          </div>
          <div className="form-field">
            <label>Body</label>
            <ReactQuill theme="snow" value={form.body || ''} onChange={val => update('body', val)} />
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h4>SEO</h4>
            <div className="form-field">
              <label>SEO Title</label>
              <input value={form.seo_title || ''} onChange={e => update('seo_title', e.target.value)} />
            </div>
            <div className="form-field">
              <label>SEO Description</label>
              <textarea value={form.seo_description || ''} onChange={e => update('seo_description', e.target.value)} />
            </div>
            <div className="form-field">
              <label>SEO Keywords</label>
              <input value={form.seo_keywords || ''} onChange={e => update('seo_keywords', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Order</label>
              <input type="number" value={form.order_index || 0} onChange={e => update('order_index', Number(e.target.value))} />
            </div>
          </div>

          {!isNew && (
            <div className="card">
              <h4>Version History</h4>
              {versions.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No previous versions.</p>}
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem' }}>
                {versions.map(v => (
                  <li key={v.id} style={{ marginBottom: 8, borderBottom: '1px solid var(--surface-border)', paddingBottom: 8 }}>
                    <div>{v.edited_by_name || 'Unknown'} — {new Date(v.created_at).toLocaleString()}</div>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', marginTop: 4 }}
                      onClick={() => setForm({ ...empty, ...(typeof v.snapshot === 'string' ? JSON.parse(v.snapshot) : v.snapshot) })}
                    >
                      Restore this version
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showMediaPicker && (
        <MediaPicker
          onSelect={url => { update('featured_image', url); setShowMediaPicker(false); }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, overflowY: 'auto', padding: 40 }}>
          <div className="container card" style={{ maxWidth: 800 }}>
            <button className="btn btn-outline" onClick={() => setShowPreview(false)} style={{ marginBottom: 20 }}>Close Preview</button>
            <h1>{form.title}</h1>
            {form.featured_image && <img src={form.featured_image} alt="" style={{ borderRadius: 12, marginBottom: 20 }} />}
            <p style={{ color: 'var(--text-dim)' }}>{form.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: form.body }} />
          </div>
        </div>
      )}
    </div>
  );
}
