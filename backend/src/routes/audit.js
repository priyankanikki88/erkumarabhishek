const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const { entity, action } = req.query;
  let sql = `SELECT a.*, u.name as user_name FROM audit_logs a LEFT JOIN users u ON u.id = a.user_id WHERE 1=1`;
  const params = [];
  if (entity) { sql += ' AND a.entity = ?'; params.push(entity); }
  if (action) { sql += ' AND a.action = ?'; params.push(action); }
  sql += ' ORDER BY a.created_at DESC LIMIT 500';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

module.exports = router;
