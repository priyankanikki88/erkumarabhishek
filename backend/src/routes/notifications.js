const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
  const [[{ unread }]] = await pool.query('SELECT COUNT(*) as unread FROM notifications WHERE is_read = 0');
  res.json({ notifications: rows, unread });
});

router.patch('/:id/read', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

router.patch('/read-all', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
  res.json({ ok: true });
});

module.exports = router;
