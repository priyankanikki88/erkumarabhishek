const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

router.get('/', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const { status, source } = req.query;
  let sql = `SELECT l.*, u.name as assigned_to_name FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND l.status = ?'; params.push(status); }
  if (source) { sql += ' AND l.source = ?'; params.push(source); }
  sql += ' ORDER BY l.created_at DESC LIMIT 1000';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.patch('/:id', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const { status, assigned_to } = req.body;
  const [existingRows] = await pool.query('SELECT * FROM leads WHERE id = ?', [req.params.id]);
  if (!existingRows[0]) return res.status(404).json({ error: 'Not found' });
  const existing = existingRows[0];

  await pool.query('UPDATE leads SET status = ?, assigned_to = ? WHERE id = ?', [
    status ?? existing.status, assigned_to ?? existing.assigned_to, req.params.id
  ]);
  await logAudit(req, 'update_lead', 'lead', req.params.id, { status });
  res.json({ ok: true });
});

router.get('/funnel', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM leads GROUP BY status');
  res.json(rows);
});

module.exports = router;
