import { useState } from 'react';
import api from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', text: 'Thanks! Your message has been sent.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container" style={{ maxWidth: 640 }}>
      <div className="section-title">
        <h1>Contact</h1>
        <p>Have a project in mind? Send a message.</p>
      </div>
      <form className="card" onSubmit={submit}>
        <div className="form-field">
          <label>Name *</label>
          <input required value={form.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Email *</label>
          <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Phone</label>
          <input value={form.phone} onChange={e => update('phone', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Subject</label>
          <input value={form.subject} onChange={e => update('subject', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Message *</label>
          <textarea required value={form.message} onChange={e => update('message', e.target.value)} />
        </div>
        {status && <p style={{ color: status.type === 'success' ? '#00cec9' : '#ff7675' }}>{status.text}</p>}
        <button className="btn" disabled={submitting} type="submit">{submitting ? 'Sending…' : 'Send Message'}</button>
      </form>
    </section>
  );
}
