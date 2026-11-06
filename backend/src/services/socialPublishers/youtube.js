const fs = require('fs');

function getRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI || `${process.env.PUBLIC_BASE_URL}/api/social/callback/youtube`;
}

function getOAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ].join(' '),
    state
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function exchangeCodeForToken(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code'
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || 'Google token exchange failed');
  return data;
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || 'Google token refresh failed');
  return data;
}

async function getChannel(accessToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Could not fetch YouTube channel');
  return data.items?.[0];
}

async function publish({ account, post, mediaAbsolutePath, mediaMime }) {
  if (post.post_type === 'photo' || !mediaAbsolutePath) {
    throw new Error('YouTube only accepts video uploads, not photos or text-only posts');
  }

  const { size } = fs.statSync(mediaAbsolutePath);
  const metadata = {
    snippet: {
      title: (post.caption || 'New upload').slice(0, 100) || 'New upload',
      description: post.caption || ''
    },
    status: { privacyStatus: 'public' }
  };

  const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': mediaMime || 'video/mp4',
      'X-Upload-Content-Length': String(size)
    },
    body: JSON.stringify(metadata)
  });
  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'YouTube upload session could not be started');
  }
  const uploadUrl = initRes.headers.get('location');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mediaMime || 'video/mp4',
      'Content-Length': String(size)
    },
    body: fs.createReadStream(mediaAbsolutePath),
    duplex: 'half'
  });
  const data = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(data.error?.message || 'YouTube upload failed');

  return { platformPostId: data.id, platformPostUrl: `https://www.youtube.com/watch?v=${data.id}` };
}

module.exports = { getOAuthUrl, exchangeCodeForToken, refreshAccessToken, getChannel, publish };
