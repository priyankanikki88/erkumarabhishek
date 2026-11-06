const GRAPH_VERSION = process.env.GRAPH_API_VERSION || 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function getRedirectUri() {
  return process.env.FACEBOOK_REDIRECT_URI || `${process.env.PUBLIC_BASE_URL}/api/social/callback/facebook`;
}

function getOAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: getRedirectUri(),
    state,
    scope: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'business_management',
      'instagram_basic',
      'instagram_content_publish'
    ].join(',')
  });
  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params}`;
}

async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: getRedirectUri(),
    code
  });
  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Facebook token exchange failed');
  return data.access_token;
}

async function getLongLivedUserToken(shortLivedToken) {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    fb_exchange_token: shortLivedToken
  });
  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Facebook long-lived token exchange failed');
  return data.access_token;
}

async function listPagesWithInstagram(userToken) {
  const params = new URLSearchParams({
    fields: 'id,name,access_token,instagram_business_account{id,username}',
    access_token: userToken
  });
  const res = await fetch(`${GRAPH_BASE}/me/accounts?${params}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Could not list Facebook pages');
  return data.data || [];
}

async function graphPost(path, body) {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Facebook API error on ${path}`);
  return data;
}

async function publish({ account, post, mediaUrl }) {
  const pageId = account.platform_account_id;
  const pageToken = account.accessToken;

  if (post.post_type === 'text' || !mediaUrl) {
    const data = await graphPost(`/${pageId}/feed`, { message: post.caption || '', access_token: pageToken });
    return { platformPostId: data.id, platformPostUrl: `https://www.facebook.com/${data.id}` };
  }

  if (post.post_type === 'photo') {
    const data = await graphPost(`/${pageId}/photos`, { url: mediaUrl, caption: post.caption || '', access_token: pageToken });
    const postId = data.post_id || data.id;
    return { platformPostId: postId, platformPostUrl: `https://www.facebook.com/${postId}` };
  }

  if (post.post_type === 'video') {
    const data = await graphPost(`/${pageId}/videos`, { file_url: mediaUrl, description: post.caption || '', access_token: pageToken });
    return { platformPostId: data.id, platformPostUrl: `https://www.facebook.com/${pageId}/videos/${data.id}` };
  }

  if (post.post_type === 'reel') {
    const start = await graphPost(`/${pageId}/video_reels`, { upload_phase: 'start', access_token: pageToken });

    const uploadRes = await fetch(start.upload_url, {
      method: 'POST',
      headers: { Authorization: `OAuth ${pageToken}`, file_url: mediaUrl }
    });
    const uploadData = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok || uploadData.success === false) {
      throw new Error(uploadData.error?.message || 'Facebook Reel upload failed');
    }

    const finish = await graphPost(`/${pageId}/video_reels`, {
      upload_phase: 'finish',
      video_id: start.video_id,
      video_state: 'PUBLISHED',
      description: post.caption || '',
      access_token: pageToken
    });
    if (finish.success === false) throw new Error('Facebook Reel publish failed');
    return { platformPostId: start.video_id, platformPostUrl: `https://www.facebook.com/reel/${start.video_id}` };
  }

  throw new Error(`Unsupported post type for Facebook: ${post.post_type}`);
}

module.exports = { getOAuthUrl, exchangeCodeForToken, getLongLivedUserToken, listPagesWithInstagram, publish };
