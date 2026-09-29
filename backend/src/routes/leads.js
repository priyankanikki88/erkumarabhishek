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

router.get('/funnel', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM leads GROUP BY status');
  res.json(rows);
});

router.get('/sources', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query('SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC');
  res.json(rows);
});

router.get('/:id', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT l.*, u.name as assigned_to_name FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE l.id = ?`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.patch('/:id', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const { status, assigned_to } = req.body;
  const [existingRows] = await pool.query('SELECT * FROM leads WHERE id = ?', [req.params.id]);
  if (!existingRows[0]) return res.status(404).json({ error: 'Not found' });
  const existing = existingRows[0];

  await pool.query('UPDATE leads SET status = ?, assigned_to = ? WHERE id = ?', [
    status ?? existing.status, assigned_to ?? existing.assigned_to, req.params.id
  ]);

  if (status && status !== existing.status) {
    await pool.query('INSERT INTO lead_activities (lead_id, type, notes, created_by) VALUES (?, "status_change", ?, ?)', [
      req.params.id, `Status changed from ${existing.status} to ${status}`, req.user.id
    ]);
  }

  await logAudit(req, 'update_lead', 'lead', req.params.id, { status });
  res.json({ ok: true });
});

router.get('/:id/activities', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, u.name as created_by_name FROM lead_activities a LEFT JOIN users u ON u.id = a.created_by
     WHERE a.lead_id = ? ORDER BY a.created_at DESC`,
    [req.params.id]
  );
  res.json(rows);
});

router.post(
  '/:id/activities',
  authenticate,
  authorize('superadmin', 'admin', 'editor'),
  [body('type').isIn(['note', 'call', 'email', 'follow_up']), body('notes').optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, notes, follow_up_date } = req.body;
    const [result] = await pool.query(
      'INSERT INTO lead_activities (lead_id, type, notes, follow_up_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, type, notes || null, follow_up_date || null, req.user.id]
    );
    await logAudit(req, 'add_lead_activity', 'lead', req.params.id, { type });
    res.status(201).json({ id: result.insertId });
  }
);

module.exports = router;
