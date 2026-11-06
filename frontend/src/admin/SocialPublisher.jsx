import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import MediaPicker from './MediaPicker';

const PLATFORM_LABELS = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };
const POST_TYPES = [
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'reel', label: 'Reel / Short' },
  { value: 'text', label: 'Text only (Facebook only)' }
];

function isCompatible(platform, postType) {
  if (platform === 'youtube') return postType === 'video' || postType === 'reel';
  if (platform === 'instagram') return postType !== 'text';
  return true;
}

function targetStatusClass(status) {
  if (status === 'success') return 'status-published';
  if (status === 'failed') return 'status-unpublished';
  return 'status-draft';
}

export default function SocialPublisher() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [banner, setBanner] = useState(null);

  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState('photo');
  const [media, setMedia] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function loadAccounts() {
    api.get('/social/accounts').then(res => setAccounts(res.data));
  }
  function loadPosts() {
    api.get('/social/posts').then(res => setPosts(res.data));
  }

  useEffect(() => {
    loadAccounts();
    loadPosts();
  }, []);

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    if (connected) setBanner({ type: 'success', text: `${PLATFORM_LABELS[connected] || connected} connected.` });
    if (error) setBanner({ type: 'error', text: error });
    if (connected || error) {
      loadAccounts();
      navigate('/admin/social', { replace: true });
    }
  }, [searchParams]);

  function toggleAccount(id) {
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  useEffect(() => {
    setSelectedAccounts(prev => prev.filter(id => {
      const account = accounts.find(a => a.id === id);
      return account && isCompatible(account.platform, postType);
    }));
  }, [postType, accounts]);

  async function handlePublish() {
    if (!selectedAccounts.length) {
      setBanner({ type: 'error', text: 'Select at least one connected account to publish to.' });
      return;
    }
    if (postType !== 'text' && !media) {
      setBanner({ type: 'error', text: 'Pick an image or video for this post type.' });
      return;
    }
    setPublishing(true);
    setBanner(null);
    try {
      await api.post('/social/posts', {
        caption,
        post_type: postType,
        media_id: media?.id || null,
        account_ids: selectedAccounts
      });
      setCaption('');
      setMedia(null);
      setSelectedAccounts([]);
      loadPosts();
      setBanner({ type: 'success', text: 'Post submitted — check status per platform below.' });
    } catch (err) {
      setBanner({ type: 'error', text: err.response?.data?.error || 'Could not publish this post.' });
    } finally {
      setPublishing(false);
    }
  }

  async function retry(postId) {
    await api.post(`/social/posts/${postId}/retry`);
    loadPosts();
  }

  async function disconnect(id) {
    if (!confirm('Disconnect this account?')) return;
    await api.delete(`/social/accounts/${id}`);
    loadAccounts();
  }

  const grouped = accounts.reduce((acc, a) => {
    (acc[a.platform] = acc[a.platform] || []).push(a);
    return acc;
  }, {});

  return (
    <div>
      <div className="admin-topbar">
        <h2>Social Publisher</h2>
      </div>

      {banner && (
        <div className="card" style={{ marginBottom: 20, borderColor: banner.type === 'error' ? '#ff7675' : '#00cec9' }}>
          {banner.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <h4>Connected Accounts</h4>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: 16 }}>
          Connecting Facebook also links any Instagram Business account attached to your Facebook Page.
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <a className="btn" href="/api/social/connect/facebook">+ Connect Facebook &amp; Instagram</a>
          <a className="btn btn-outline" href="/api/social/connect/youtube">+ Connect YouTube</a>
        </div>
        <div className="grid grid-3">
          {['facebook', 'instagram', 'youtube'].map(platform => (
            <div key={platform} className="card" style={{ padding: 16 }}>
              <strong>{PLATFORM_LABELS[platform]}</strong>
              {(grouped[platform] || []).length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 8 }}>Not connected</p>}
              {(grouped[platform] || []).map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: '0.85rem' }}>{a.account_name}</span>
                  <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ff7675' }} onClick={() => disconnect(a.id)}>Remove</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4>Compose a Post</h4>
        <div className="form-field">
          <label>Post type</label>
          <select value={postType} onChange={e => setPostType(e.target.value)}>
            {POST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Caption</label>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." />
        </div>
        {postType !== 'text' && (
          <div className="form-field">
            <label>Media</label>
            {media ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {media.kind === 'image' ? <img src={media.url} alt="" style={{ height: 70, borderRadius: 8 }} /> : <span className="badge">{media.kind}</span>}
                <button className="btn btn-outline" onClick={() => setMedia(null)}>Remove</button>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => setShowPicker(true)}>Choose from Media Library</button>
            )}
          </div>
        )}
        <div className="form-field">
          <label>Publish to</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {accounts.map(a => {
              const compatible = isCompatible(a.platform, postType);
              return (
                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: compatible ? 1 : 0.4, fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    disabled={!compatible}
                    checked={selectedAccounts.includes(a.id)}
                    onChange={() => toggleAccount(a.id)}
                  />
                  {PLATFORM_LABELS[a.platform]} — {a.account_name}
                </label>
              );
            })}
            {!accounts.length && <span style={{ color: 'var(--text-dim)' }}>Connect an account above first.</span>}
          </div>
        </div>
        <button className="btn" disabled={publishing} onClick={handlePublish}>
          {publishing ? 'Publishing…' : 'Publish Everywhere'}
        </button>
      </div>

      <div className="card">
        <h4>Post History</h4>
        {!posts.length && <p style={{ color: 'var(--text-dim)' }}>No posts yet.</p>}
        {posts.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid var(--surface-border)', padding: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0 }}>{p.caption || <em style={{ color: 'var(--text-dim)' }}>No caption</em>}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {p.post_type} · {new Date(p.created_at).toLocaleString()} · by {p.created_by_name || 'unknown'}
                </p>
              </div>
              {p.media_url && (p.media_kind === 'image'
                ? <img src={p.media_url} alt="" style={{ height: 60, borderRadius: 8 }} />
                : <span className="badge">{p.media_kind}</span>)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {p.targets.map(t => (
                <span key={t.id} className={`status-pill ${targetStatusClass(t.status)}`} title={t.error_message || ''}>
                  {PLATFORM_LABELS[t.platform]}: {t.status}
                  {t.status === 'success' && t.platform_post_url && (
                    <> · <a href={t.platform_post_url} target="_blank" rel="noreferrer">view</a></>
                  )}
                </span>
              ))}
            </div>
            {p.status === 'failed' || p.status === 'partial' ? (
              <button className="btn btn-outline" style={{ marginTop: 10, padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => retry(p.id)}>
                Retry failed platforms
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {showPicker && (
        <MediaPicker
          onSelect={(url) => {
            api.get('/media').then(res => {
              const m = res.data.find(x => x.url === url);
              if (m) setMedia({ id: m.id, url: m.url, kind: m.kind });
              setShowPicker(false);
            });
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
