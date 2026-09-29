import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import MediaPicker from './MediaPicker';

const empty = {
  name: '', slug: '', category_id: '', description: '', price: '', status: 'draft',
  seo_title: '', seo_description: '', order_index: 0, specifications: {}
};

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [images, setImages] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [specRows, setSpecRows] = useState([{ key: '', value: '' }]);
  const [pickerFor, setPickerFor] = useState(null);
  const [saving, setSaving] = useState(false);

  function loadCategories() {
    api.get('/products/categories/public').then(res => setCategories(res.data));
  }
  useEffect(loadCategories, []);

  useEffect(() => {
    if (!isNew) {
      api.get('/products').then(res => {
        const p = res.data.find(x => String(x.id) === id);
        if (p) {
          setForm({ ...empty, ...p, category_id: p.category_id || '' });
          setImages((p.images || []).map(i => ({ media_id: i.media_id, url: i.url, is_primary: i.is_primary })));
          setBrochures((p.brochures || []).map(b => ({ media_id: b.media_id, url: b.url })));
          const specs = p.specifications || {};
          const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
          setSpecRows(rows.length ? rows : [{ key: '', value: '' }]);
        }
      });
    }
  }, [id]);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    const res = await api.post('/products/categories', { name: newCategory });
    setNewCategory('');
    loadCategories();
    update('category_id', res.data.id);
  }

  function updateSpecRow(i, field, value) {
    setSpecRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }

  async function save(status) {
    setSaving(true);
    const specifications = {};
    specRows.forEach(r => { if (r.key) specifications[r.key] = r.value; });

    const media_ids = [
      ...images.map(i => ({ media_id: i.media_id, kind: 'image', is_primary: i.is_primary })),
      ...brochures.map(b => ({ media_id: b.media_id, kind: 'brochure', is_primary: false }))
    ];

    const payload = { ...form, status: status || form.status, specifications, media_ids, category_id: form.category_id || null, price: form.price || null };

    try {
      if (isNew) {
        const res = await api.post('/products', payload);
        navigate(`/admin/products/${res.data.id}`);
      } else {
        await api.put(`/products/${id}`, payload);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h2>{isNew ? 'New Product' : `Edit: ${form.name}`}</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => save('draft')} disabled={saving}>Save Draft</button>
          <button className="btn" onClick={() => save('published')} disabled={saving}>Publish</button>
        </div>
      </div>

      <div className="card">
        <div className="form-field">
          <label>Name</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <select value={form.category_id} onChange={e => update('category_id', e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }} />
            <button type="button" className="btn btn-outline" onClick={addCategory}>Add</button>
          </div>
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={form.description || ''} onChange={e => update('description', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Price (₹)</label>
          <input type="number" value={form.price || ''} onChange={e => update('price', e.target.value)} />
        </div>

        <div className="form-field">
          <label>Specifications</label>
          {specRows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <input placeholder="Key" value={r.key} onChange={e => updateSpecRow(i, 'key', e.target.value)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }} />
              <input placeholder="Value" value={r.value} onChange={e => updateSpecRow(i, 'value', e.target.value)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }} />
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={() => setSpecRows(r => [...r, { key: '', value: '' }])}>+ Add Spec</button>
        </div>

        <div className="form-field">
          <label>Images</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img.url} alt="" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                <button type="button" onClick={() => setImages(imgs => imgs.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -6, right: -6, background: '#ff7675', border: 'none', borderRadius: '50%', width: 22, height: 22, color: 'white', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => setPickerFor('image')}>+ Add Image</button>
        </div>

        <div className="form-field">
          <label>Brochures (PDF)</label>
          <ul>
            {brochures.map((b, i) => (
              <li key={i}><a href={b.url} target="_blank" rel="noreferrer">{b.url}</a> <button type="button" onClick={() => setBrochures(bs => bs.filter((_, idx) => idx !== i))}>Remove</button></li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline" onClick={() => setPickerFor('brochure')}>+ Add Brochure</button>
        </div>

        <div className="form-field">
          <label>SEO Title</label>
          <input value={form.seo_title || ''} onChange={e => update('seo_title', e.target.value)} />
        </div>
        <div className="form-field">
          <label>SEO Description</label>
          <textarea value={form.seo_description || ''} onChange={e => update('seo_description', e.target.value)} />
        </div>
      </div>

      {pickerFor && (
        <MediaPicker
          onClose={() => setPickerFor(null)}
          onSelect={(url) => {
            // find media_id via lookup: MediaPicker only returns url; we search media list synchronously not available.
            // Instead store url + a temp negative id resolved on backend by url isn't supported, so fetch by matching url.
            api.get('/media').then(res => {
              const m = res.data.find(x => x.url === url);
              if (!m) return;
              if (pickerFor === 'image') setImages(imgs => [...imgs, { media_id: m.id, url: m.url, is_primary: imgs.length === 0 }]);
              else setBrochures(bs => [...bs, { media_id: m.id, url: m.url }]);
              setPickerFor(null);
            });
          }}
        />
      )}
    </div>
  );
}
