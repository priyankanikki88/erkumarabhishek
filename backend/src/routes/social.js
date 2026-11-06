const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const { notify } = require('../utils/notify');
const { encrypt, decrypt } = require('../utils/crypto');
const facebook = require('../services/socialPublishers/facebook');
const youtube = require('../services/socialPublishers/youtube');
const { publishToTarget } = require('../services/socialPublishers');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || (process.env.CLIENT_URL || '').split(',')[0] || '').replace(/\/$/, '');

function requireSocialEnv(platform) {
  if (platform === 'facebook' && (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET)) {
    throw new Error('Facebook app credentials are not configured on the server');
  }
  if (platform === 'youtube' && (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)) {
    throw new Error('Google app credentials are not configured on the server');
  }
}

function isCompatible(platform, postType) {
  if (platform === 'youtube') return postType === 'video' || postType === 'reel';
  if (platform === 'instagram') return postType !== 'text';
  return true;
}

function publicAccount(row) {
  return {
    id: row.id,
    platform: row.platform,
    account_name: row.account_name,
    platform_account_id: row.platform_account_id,
    connected_at: row.created_at
  };
}

async function ensureFreshAccessToken(account) {
  let accessToken = decrypt(account.access_token_enc);
  if (account.platform === 'youtube') {
    const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0;
    if (!expiresAt || expiresAt < Date.now() + 60 * 1000) {
      const refreshToken = decrypt(account.refresh_token_enc);
      const refreshed = await youtube.refreshAccessToken(refreshToken);
      accessToken = refreshed.access_token;
      const newExpiry = new Date(Date.now() + (refreshed.expires_in || 3600) * 1000);
      await pool.query('UPDATE social_accounts SET access_token_enc = ?, token_expires_at = ? WHERE id = ?', [encrypt(accessToken), newExpiry, account.id]);
    }
  }
  return accessToken;
}

router.get('/accounts', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM social_accounts ORDER BY platform, account_name');
  res.json(rows.map(publicAccount));
});

router.delete('/accounts/:id', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM social_accounts WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  await pool.query('DELETE FROM social_accounts WHERE id = ?', [req.params.id]);
  await logAudit(req, 'disconnect_social_account', 'social_account', req.params.id, { platform: rows[0].platform, account_name: rows[0].account_name });
  res.json({ ok: true });
});

router.get('/connect/facebook', authenticate, authorize('superadmin', 'admin'), (req, res) => {
  try {
    requireSocialEnv('facebook');
    const state = jwt.sign({ platform: 'facebook', uid: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.redirect(facebook.getOAuthUrl(state));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/callback/facebook', async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;
  const redirectBase = `${PUBLIC_BASE_URL}/admin/social`;
  if (error) return res.redirect(`${redirectBase}?error=${encodeURIComponent(errorDescription || error)}`);

  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    if (decoded.platform !== 'facebook') throw new Error('Invalid OAuth state');

    const shortToken = await facebook.exchangeCodeForToken(code);
    const longToken = await facebook.getLongLivedUserToken(shortToken);
    const pages = await facebook.listPagesWithInstagram(longToken);

    if (!pages.length) {
      return res.redirect(`${redirectBase}?error=${encodeURIComponent('No Facebook Pages found — you need admin access to at least one Facebook Page.')}`);
    }

    for (const page of pages) {
      await pool.query(
        `INSERT INTO social_accounts (platform, account_name, platform_account_id, access_token_enc, meta, connected_by)
         VALUES ('facebook', ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE account_name = VALUES(account_name), access_token_enc = VALUES(access_token_enc), meta = VALUES(meta), connected_by = VALUES(connected_by)`,
        [page.name, page.id, encrypt(page.access_token), JSON.stringify({}), decoded.uid]
      );

      if (page.instagram_business_account?.id) {
        await pool.query(
          `INSERT INTO social_accounts (platform, account_name, platform_account_id, access_token_enc, meta, connected_by)
           VALUES ('instagram', ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE account_name = VALUES(account_name), access_token_enc = VALUES(access_token_enc), meta = VALUES(meta), connected_by = VALUES(connected_by)`,
          [
            page.instagram_business_account.username || page.name,
            page.instagram_business_account.id,
            encrypt(page.access_token),
            JSON.stringify({ linked_page_id: page.id }),
            decoded.uid
          ]
        );
      }
    }

    req.user = { id: decoded.uid };
    await logAudit(req, 'connect_social_account', 'social_account', null, { platform: 'facebook', pages: pages.map(p => p.name) });
    res.redirect(`${redirectBase}?connected=facebook`);
  } catch (err) {
    console.error('Facebook OAuth callback error:', err.message);
    res.redirect(`${redirectBase}?error=${encodeURIComponent(err.message)}`);
  }
});

router.get('/connect/youtube', authenticate, authorize('superadmin', 'admin'), (req, res) => {
  try {
    requireSocialEnv('youtube');
    const state = jwt.sign({ platform: 'youtube', uid: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.redirect(youtube.getOAuthUrl(state));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/callback/youtube', async (req, res) => {
  const { code, state, error } = req.query;
  const redirectBase = `${PUBLIC_BASE_URL}/admin/social`;
  if (error) return res.redirect(`${redirectBase}?error=${encodeURIComponent(error)}`);

  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    if (decoded.platform !== 'youtube') throw new Error('Invalid OAuth state');

    const tokenData = await youtube.exchangeCodeForToken(code);
    if (!tokenData.refresh_token) {
      throw new Error('Google did not return a refresh token — revoke access at https://myaccount.google.com/permissions and reconnect');
    }
    const channel = await youtube.getChannel(tokenData.access_token);
    if (!channel) throw new Error('No YouTube channel found for this Google account');

    await pool.query(
      `INSERT INTO social_accounts (platform, account_name, platform_account_id, access_token_enc, refresh_token_enc, token_expires_at, meta, connected_by)
       VALUES ('youtube', ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE account_name = VALUES(account_name), access_token_enc = VALUES(access_token_enc), refresh_token_enc = VALUES(refresh_token_enc), token_expires_at = VALUES(token_expires_at), meta = VALUES(meta), connected_by = VALUES(connected_by)`,
      [
        channel.snippet?.title || 'YouTube channel',
        channel.id,
        encrypt(tokenData.access_token),
        encrypt(tokenData.refresh_token),
        new Date(Date.now() + (tokenData.expires_in || 3600) * 1000),
        JSON.stringify({}),
        decoded.uid
      ]
    );

    req.user = { id: decoded.uid };
    await logAudit(req, 'connect_social_account', 'social_account', null, { platform: 'youtube', channel: channel.snippet?.title });
    res.redirect(`${redirectBase}?connected=youtube`);
  } catch (err) {
    console.error('YouTube OAuth callback error:', err.message);
    res.redirect(`${redirectBase}?error=${encodeURIComponent(err.message)}`);
  }
});

router.get('/posts', authenticate, async (req, res) => {
  const [posts] = await pool.query(
    `SELECT p.*, m.url as media_url, m.kind as media_kind, u.name as created_by_name
     FROM social_posts p
     LEFT JOIN media m ON m.id = p.media_id
     LEFT JOIN users u ON u.id = p.created_by
     ORDER BY p.created_at DESC LIMIT 100`
  );
  if (!posts.length) return res.json([]);

  const [targets] = await pool.query(
    `SELECT t.*, a.account_name FROM social_post_targets t JOIN social_accounts a ON a.id = t.account_id WHERE t.post_id IN (?)`,
    [posts.map(p => p.id)]
  );
  const byPost = {};
  for (const t of targets) {
    (byPost[t.post_id] = byPost[t.post_id] || []).push(t);
  }
  res.json(posts.map(p => ({ ...p, targets: byPost[p.id] || [] })));
});

router.post(
  '/posts',
  authenticate,
  authorize('superadmin', 'admin', 'editor'),
  [
    body('post_type').isIn(['text', 'photo', 'video', 'reel']),
    body('caption').optional({ nullable: true }).isString().isLength({ max: 2200 }),
    body('media_id').optional({ nullable: true }).isInt(),
    body('account_ids').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { post_type, caption, media_id } = req.body;
    const accountIds = req.body.account_ids.map(Number).filter(Number.isInteger);
    if (!accountIds.length) return res.status(400).json({ error: 'No valid accounts selected' });

    let media = null;
    if (media_id) {
      const [rows] = await pool.query('SELECT * FROM media WHERE id = ?', [media_id]);
      media = rows[0] || null;
    }
    if (post_type !== 'text' && !media) {
      return res.status(400).json({ error: 'This post type requires a media file' });
    }

    const [accountRows] = await pool.query('SELECT * FROM social_accounts WHERE id IN (?)', [accountIds]);
    if (!accountRows.length) return res.status(400).json({ error: 'No valid accounts selected' });

    const [postResult] = await pool.query(
      'INSERT INTO social_posts (caption, post_type, media_id, status, created_by) VALUES (?, ?, ?, "publishing", ?)',
      [caption || null, post_type, media?.id || null, req.user.id]
    );
    const postId = postResult.insertId;

    const mediaUrl = media ? `${PUBLIC_BASE_URL}${media.url}` : null;
    const mediaAbsolutePath = media ? path.join(UPLOAD_DIR, media.filename) : null;
    const post = { post_type, caption };

    const results = await Promise.all(accountRows.map(async (account) => {
      const [targetResult] = await pool.query(
        'INSERT INTO social_post_targets (post_id, account_id, platform, status) VALUES (?, ?, ?, "publishing")',
        [postId, account.id, account.platform]
      );
      const targetId = targetResult.insertId;

      if (!isCompatible(account.platform, post_type)) {
        const errorMessage = `${account.platform} does not support ${post_type} posts`;
        await pool.query('UPDATE social_post_targets SET status = "failed", error_message = ?, attempted_at = NOW() WHERE id = ?', [errorMessage, targetId]);
        return { ok: false };
      }

      try {
        const accessToken = await ensureFreshAccessToken(account);
        const { platformPostId, platformPostUrl } = await publishToTarget(
          { id: account.id, platform: account.platform, platform_account_id: account.platform_account_id, accessToken },
          post,
          { mediaUrl, mediaAbsolutePath, mediaMime: media?.mime_type }
        );
        await pool.query(
          'UPDATE social_post_targets SET status = "success", platform_post_id = ?, platform_post_url = ?, attempted_at = NOW() WHERE id = ?',
          [platformPostId || null, platformPostUrl || null, targetId]
        );
        return { ok: true };
      } catch (err) {
        console.error(`Social publish failed (${account.platform}/${account.id}):`, err.message);
        await pool.query('UPDATE social_post_targets SET status = "failed", error_message = ?, attempted_at = NOW() WHERE id = ?', [err.message.slice(0, 1000), targetId]);
        return { ok: false };
      }
    }));

    const successCount = results.filter(r => r.ok).length;
    const finalStatus = successCount === results.length ? 'completed' : successCount === 0 ? 'failed' : 'partial';
    await pool.query('UPDATE social_posts SET status = ? WHERE id = ?', [finalStatus, postId]);

    await logAudit(req, 'create_social_post', 'social_post', postId, { post_type, accounts: accountRows.map(a => a.platform) });
    if (finalStatus !== 'completed') {
      await notify('social_post_issue', 'Social post needs attention', `A post ${finalStatus === 'failed' ? 'failed on every platform' : 'partially failed'} — check Social Publisher`, '/admin/social');
    }

    const [targets] = await pool.query(
      'SELECT t.*, a.account_name FROM social_post_targets t JOIN social_accounts a ON a.id = t.account_id WHERE t.post_id = ?',
      [postId]
    );
    res.status(201).json({ id: postId, status: finalStatus, targets });
  }
);

router.post('/posts/:id/retry', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [postRows] = await pool.query('SELECT * FROM social_posts WHERE id = ?', [req.params.id]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: 'Not found' });

  const [failedTargets] = await pool.query(
    `SELECT t.id as target_id, t.account_id as id, t.platform,
            a.access_token_enc, a.refresh_token_enc, a.token_expires_at, a.platform_account_id
     FROM social_post_targets t JOIN social_accounts a ON a.id = t.account_id
     WHERE t.post_id = ? AND t.status = 'failed'`,
    [post.id]
  );
  if (!failedTargets.length) return res.json({ ok: true, message: 'Nothing to retry' });

  let media = null;
  if (post.media_id) {
    const [rows] = await pool.query('SELECT * FROM media WHERE id = ?', [post.media_id]);
    media = rows[0] || null;
  }
  const mediaUrl = media ? `${PUBLIC_BASE_URL}${media.url}` : null;
  const mediaAbsolutePath = media ? path.join(UPLOAD_DIR, media.filename) : null;

  await Promise.all(failedTargets.map(async (row) => {
    if (!isCompatible(row.platform, post.post_type)) return;
    try {
      const accessToken = await ensureFreshAccessToken(row);
      const { platformPostId, platformPostUrl } = await publishToTarget(
        { id: row.id, platform: row.platform, platform_account_id: row.platform_account_id, accessToken },
        { post_type: post.post_type, caption: post.caption },
        { mediaUrl, mediaAbsolutePath, mediaMime: media?.mime_type }
      );
      await pool.query(
        'UPDATE social_post_targets SET status = "success", platform_post_id = ?, platform_post_url = ?, error_message = NULL, attempted_at = NOW() WHERE id = ?',
        [platformPostId || null, platformPostUrl || null, row.target_id]
      );
    } catch (err) {
      await pool.query('UPDATE social_post_targets SET error_message = ?, attempted_at = NOW() WHERE id = ?', [err.message.slice(0, 1000), row.target_id]);
    }
  }));

  const [allTargets] = await pool.query('SELECT status FROM social_post_targets WHERE post_id = ?', [post.id]);
  const successCount = allTargets.filter(t => t.status === 'success').length;
  const finalStatus = successCount === allTargets.length ? 'completed' : successCount === 0 ? 'failed' : 'partial';
  await pool.query('UPDATE social_posts SET status = ? WHERE id = ?', [finalStatus, post.id]);

  await logAudit(req, 'retry_social_post', 'social_post', post.id, { retried: failedTargets.length });
  res.json({ ok: true, status: finalStatus });
});

module.exports = router;
