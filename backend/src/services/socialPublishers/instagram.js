const GRAPH_VERSION = process.env.GRAPH_API_VERSION || 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

async function graphPost(path, body) {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Instagram API error on ${path}`);
  return data;
}

async function graphGet(path, params) {
  const res = await fetch(`${GRAPH_BASE}${path}?${new URLSearchParams(params)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Instagram API error on ${path}`);
  return data;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUntilReady(creationId, token, { tries = 20, intervalMs = 3000 } = {}) {
  for (let i = 0; i < tries; i++) {
    const status = await graphGet(`/${creationId}`, { fields: 'status_code', access_token: token });
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') throw new Error('Instagram media processing failed');
    await sleep(intervalMs);
  }
  throw new Error('Timed out waiting for Instagram media to finish processing');
}

async function publish({ account, post, mediaUrl }) {
  const igUserId = account.platform_account_id;
  const token = account.accessToken;

  if (!mediaUrl) throw new Error('Instagram posts require an image or video');

  const creationBody = { caption: post.caption || '', access_token: token };
  if (post.post_type === 'photo') {
    creationBody.image_url = mediaUrl;
  } else if (post.post_type === 'video') {
    creationBody.media_type = 'VIDEO';
    creationBody.video_url = mediaUrl;
  } else if (post.post_type === 'reel') {
    creationBody.media_type = 'REELS';
    creationBody.video_url = mediaUrl;
  } else {
    throw new Error(`Unsupported post type for Instagram: ${post.post_type}`);
  }

  const created = await graphPost(`/${igUserId}/media`, creationBody);

  if (post.post_type !== 'photo') {
    await waitUntilReady(created.id, token);
  }

  const published = await graphPost(`/${igUserId}/media_publish`, { creation_id: created.id, access_token: token });

  let permalink = null;
  try {
    const info = await graphGet(`/${published.id}`, { fields: 'permalink', access_token: token });
    permalink = info.permalink;
  } catch (_) {
    // permalink is best-effort; the post itself already succeeded above
  }

  return { platformPostId: published.id, platformPostUrl: permalink };
}

module.exports = { publish };
