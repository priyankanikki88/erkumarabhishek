const express = require('express');
const slugify = require('slugify');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

function parseProduct(row) {
  if (!row) return row;
  if (row.specifications && typeof row.specifications === 'string') {
    try { row.specifications = JSON.parse(row.specifications); } catch (_) {}
  }
  return row;
}

async function attachMedia(products) {
  if (!products.length) return products;
  const ids = products.map(p => p.id);
  const [media] = await pool.query(
    `SELECT pm.product_id, pm.kind, pm.is_primary, m.id as media_id, m.url, m.mime_type, m.filename
     FROM product_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id IN (?)`,
    [ids]
  );
  const byProduct = {};
  media.forEach(m => {
    byProduct[m.product_id] = byProduct[m.product_id] || { images: [], brochures: [] };
    const item = { media_id: m.media_id, url: m.url, is_primary: !!m.is_primary, filename: m.filename };
    if (m.kind === 'image') byProduct[m.product_id].images.push(item);
    else byProduct[m.product_id].brochures.push(item);
  });
  return products.map(p => ({ ...p, images: byProduct[p.id]?.images || [], brochures: byProduct[p.id]?.brochures || [] }));
}

// PUBLIC
router.get('/public', async (req, res) => {
  const { category } = req.query;
  let sql = `SELECT p.*, pc.name as category_name, pc.slug as category_slug FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id WHERE p.status = "published"`;
  const params = [];
  if (category) { sql += ' AND pc.slug = ?'; params.push(category); }
  sql += ' ORDER BY p.order_index ASC';
  const [rows] = await pool.query(sql, params);
  res.json(await attachMedia(rows.map(parseProduct)));
});

router.get('/public/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND status = "published"', [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  const [withMedia] = [await attachMedia([parseProduct(rows[0])])];
  res.json(withMedia[0]);
});

router.get('/categories/public', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM product_categories ORDER BY name ASC');
  res.json(rows);
});

// ADMIN
router.get('/', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, pc.name as category_name FROM products p LEFT JOIN product_categories pc ON pc.id = p.category_id ORDER BY p.updated_at DESC`
  );
  res.json(await attachMedia(rows.map(parseProduct)));
});

router.post('/categories', authenticate, authorize('superadmin', 'admin', 'editor'), body('name').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const slug = slugify(req.body.name, { lower: true, strict: true });
  const [result] = await pool.query('INSERT INTO product_categories (name, slug, description) VALUES (?, ?, ?)', [req.body.name, slug, req.body.description || null]);
  await logAudit(req, 'create_category', 'product_category', result.insertId);
  res.status(201).json({ id: result.insertId, name: req.body.name, slug });
});

router.post(
  '/',
  authenticate,
  authorize('superadmin', 'admin', 'editor'),
  [body('name').notEmpty(), body('status').optional().isIn(['draft', 'published', 'unpublished'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, category_id, description, specifications, price, status = 'draft', seo_title, seo_description, order_index = 0 } = req.body;
    const slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });

    try {
      const [result] = await pool.query(
        `INSERT INTO products (category_id, name, slug, description, specifications, price, status, seo_title, seo_description, order_index, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [category_id || null, name, slug, description || null, specifications ? JSON.stringify(specifications) : null,
          price || null, status, seo_title || null, seo_description || null, order_index, req.user.id, req.user.id]
      );

      if (Array.isArray(req.body.media_ids)) {
        for (const item of req.body.media_ids) {
          await pool.query('INSERT INTO product_media (product_id, media_id, kind, is_primary) VALUES (?, ?, ?, ?)',
            [result.insertId, item.media_id, item.kind || 'image', item.is_primary ? 1 : 0]);
        }
      }

      await logAudit(req, 'create_product', 'product', result.insertId, { name });
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
      res.status(201).json(parseProduct(rows[0]));
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Slug already exists' });
      throw err;
    }
  }
);

router.put('/:id', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [existingRows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!existingRows[0]) return res.status(404).json({ error: 'Not found' });
  const existing = existingRows[0];

  const { name, category_id, description, specifications, price, status, seo_title, seo_description, order_index } = req.body;
  const slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : existing.slug;

  await pool.query(
    `UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, specifications = ?, price = ?, status = ?,
     seo_title = ?, seo_description = ?, order_index = ?, updated_by = ? WHERE id = ?`,
    [
      category_id ?? existing.category_id, name ?? existing.name, slug, description ?? existing.description,
      specifications !== undefined ? JSON.stringify(specifications) : existing.specifications,
      price ?? existing.price, status ?? existing.status, seo_title ?? existing.seo_title,
      seo_description ?? existing.seo_description, order_index ?? existing.order_index, req.user.id, req.params.id
    ]
  );

  if (Array.isArray(req.body.media_ids)) {
    await pool.query('DELETE FROM product_media WHERE product_id = ?', [req.params.id]);
    for (const item of req.body.media_ids) {
      await pool.query('INSERT INTO product_media (product_id, media_id, kind, is_primary) VALUES (?, ?, ?, ?)',
        [req.params.id, item.media_id, item.kind || 'image', item.is_primary ? 1 : 0]);
    }
  }

  await logAudit(req, 'update_product', 'product', req.params.id);
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(parseProduct(rows[0]));
});

router.patch('/:id/status', authenticate, authorize('superadmin', 'admin', 'editor'), body('status').isIn(['draft', 'published', 'unpublished']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const [result] = await pool.query('UPDATE products SET status = ?, updated_by = ? WHERE id = ?', [req.body.status, req.user.id, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
  await logAudit(req, `product_${req.body.status}`, 'product', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
  await logAudit(req, 'delete_product', 'product', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
