const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again later.' }
});

router.post(
  '/',
  submitLimiter,
  [
    body('name').isString().trim().isLength({ min: 2, max: 160 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().isString().isLength({ max: 40 }),
    body('subject').optional().isString().isLength({ max: 255 }),
    body('message').isString().trim().isLength({ min: 5, max: 5000 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, subject, message } = req.body;
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    // Also create a lead for CRM tracking
    await pool.query(
      'INSERT INTO leads (name, phone, email, requirement, source, consent) VALUES (?, ?, ?, ?, ?, 1)',
      [name, phone || null, email, message, 'contact_form']
    );

    res.status(201).json({ ok: true, id: result.insertId });
  }
);

router.get('/', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM contact_messages WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC LIMIT 500';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.patch('/:id/status', authenticate, authorize('superadmin', 'admin', 'editor'), body('status').isIn(['new', 'read', 'archived']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
  await logAudit(req, 'update_contact_status', 'contact_message', req.params.id, { status: req.body.status });
  res.json({ ok: true });
});

module.exports = router;
