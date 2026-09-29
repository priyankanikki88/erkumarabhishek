const express = require('express');
const slugify = require('slugify');
const { body, param, query, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

const CONTENT_TYPES = [
  'home', 'about', 'journey', 'education', 'experience', 'skills',
  'certifications', 'project', 'service', 'article', 'blog', 'marketing', 'gallery'
];

function parseRow(row) {
  if (!row) return row;
  if (row.meta && typeof row.meta === 'string') {
    try { row.meta = JSON.parse(row.meta); } catch (_) {}
  }
  return row;
}

// PUBLIC: list published content by type
router.get('/public/:type', param('type').isIn(CONTENT_TYPES), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const [rows] = await pool.query(
    'SELECT id, type, title, slug, excerpt, body, featured_image, meta, seo_title, seo_description, seo_keywords, order_index, published_at FROM content WHERE type = ? AND status = "published" ORDER BY order_index ASC, published_at DESC',
    [req.params.type]
  );
  res.json(rows.map(parseRow));
});

router.get('/public/:type/:slug', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM content WHERE type = ? AND slug = ? AND status = "published" LIMIT 1',
    [req.params.type, req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(parseRow(rows[0]));
});

// ADMIN: list all (any status) with filters
router.get('/', authenticate, async (req, res) => {
  const { type, status } = req.query;
  let sql = 'SELECT id, type, title, slug, status, order_index, updated_at, published_at FROM content WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY type ASC, order_index ASC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.get('/:id', authenticate, param('id').isInt(), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM content WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(parseRow(rows[0]));
});

router.get('/:id/versions', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT cv.id, cv.snapshot, cv.created_at, u.name as edited_by_name FROM content_versions cv LEFT JOIN users u ON u.id = cv.edited_by WHERE cv.content_id = ? ORDER BY cv.created_at DESC',
    [req.params.id]
  );
  res.json(rows);
});

async function snapshotVersion(contentId, userId) {
  const [rows] = await pool.query('SELECT * FROM content WHERE id = ?', [contentId]);
  if (!rows[0]) return;
  await pool.query(
    'INSERT INTO content_versions (content_id, snapshot, edited_by) VALUES (?, ?, ?)',
    [contentId, JSON.stringify(rows[0]), userId]
  );
}

router.post(
  '/',
  authenticate,
  authorize('superadmin', 'admin', 'editor'),
  [
    body('type').isIn(CONTENT_TYPES),
    body('title').isString().notEmpty(),
    body('status').optional().isIn(['draft', 'published', 'unpublished'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      type, title, excerpt, body: bodyContent, featured_image, meta,
      status = 'draft', seo_title, seo_description, seo_keywords, order_index = 0
    } = req.body;

    let slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

    const publishedAt = status === 'published' ? new Date() : null;

    try {
      const [result] = await pool.query(
        `INSERT INTO content (type, title, slug, excerpt, body, featured_image, meta, status, seo_title, seo_description, seo_keywords, order_index, created_by, updated_by, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [type, title, slug, excerpt || null, bodyContent || null, featured_image || null, meta ? JSON.stringify(meta) : null,
          status, seo_title || null, seo_description || null, seo_keywords || null, order_index, req.user.id, req.user.id, publishedAt]
      );
      await logAudit(req, 'create_content', 'content', result.insertId, { type, title });
      const [rows] = await pool.query('SELECT * FROM content WHERE id = ?', [result.insertId]);
      res.status(201).json(parseRow(rows[0]));
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A content item with this type+slug already exists' });
      throw err;
    }
  }
);

router.put(
  '/:id',
  authenticate,
  authorize('superadmin', 'admin', 'editor'),
  param('id').isInt(),
  async (req, res) => {
    const [existingRows] = await pool.query('SELECT * FROM content WHERE id = ?', [req.params.id]);
    if (!existingRows[0]) return res.status(404).json({ error: 'Not found' });

    await snapshotVersion(req.params.id, req.user.id);

    const {
      title, excerpt, body: bodyContent, featured_image, meta,
      status, seo_title, seo_description, seo_keywords, order_index
    } = req.body;

    const existing = existingRows[0];
    let slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : existing.slug;
    const newStatus = status || existing.status;
    const publishedAt = newStatus === 'published' && existing.status !== 'published' ? new Date() : existing.published_at;

    await pool.query(
      `UPDATE content SET title = ?, slug = ?, excerpt = ?, body = ?, featured_image = ?, meta = ?, status = ?,
       seo_title = ?, seo_description = ?, seo_keywords = ?, order_index = ?, updated_by = ?, published_at = ? WHERE id = ?`,
      [
        title ?? existing.title, slug, excerpt ?? existing.excerpt, bodyContent ?? existing.body,
        featured_image ?? existing.featured_image, meta !== undefined ? JSON.stringify(meta) : existing.meta,
        newStatus, seo_title ?? existing.seo_title, seo_description ?? existing.seo_description,
        seo_keywords ?? existing.seo_keywords, order_index ?? existing.order_index, req.user.id, publishedAt, req.params.id
      ]
    );

    await logAudit(req, 'update_content', 'content', req.params.id);
    const [rows] = await pool.query('SELECT * FROM content WHERE id = ?', [req.params.id]);
    res.json(parseRow(rows[0]));
  }
);

router.patch('/:id/status', authenticate, authorize('superadmin', 'admin', 'editor'), body('status').isIn(['draft', 'published', 'unpublished']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const [existingRows] = await pool.query('SELECT * FROM content WHERE id = ?', [req.params.id]);
  if (!existingRows[0]) return res.status(404).json({ error: 'Not found' });

  const publishedAt = req.body.status === 'published' ? new Date() : existingRows[0].published_at;
  await pool.query('UPDATE content SET status = ?, published_at = ?, updated_by = ? WHERE id = ?', [req.body.status, publishedAt, req.user.id, req.params.id]);
  await logAudit(req, `content_${req.body.status}`, 'content', req.params.id);
  res.json({ ok: true, status: req.body.status });
});

router.delete('/:id', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const [result] = await pool.query('DELETE FROM content WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
  await logAudit(req, 'delete_content', 'content', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
