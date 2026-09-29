const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [[contentCount]] = await pool.query('SELECT COUNT(*) as total, SUM(status="published") as published, SUM(status="draft") as draft FROM content');
  const [[productCount]] = await pool.query('SELECT COUNT(*) as total, SUM(status="published") as published FROM products');
  const [[leadCount]] = await pool.query('SELECT COUNT(*) as total, SUM(status="new") as new_leads FROM leads');
  const [[messageCount]] = await pool.query('SELECT COUNT(*) as total, SUM(status="new") as unread FROM contact_messages');
  const [recentAudit] = await pool.query(
    `SELECT a.action, a.entity, a.entity_id, a.created_at, u.name as user_name
     FROM audit_logs a LEFT JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC LIMIT 20`
  );

  res.json({ content: contentCount, products: productCount, leads: leadCount, messages: messageCount, recentActivity: recentAudit });
});

module.exports = router;
