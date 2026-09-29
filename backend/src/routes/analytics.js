const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { detectDevice, detectBrowser, detectOS, sourceFromReferrer } = require('../utils/uaParse');

const router = express.Router();

const trackLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });

function hashIp(ip) {
  return crypto.createHash('sha256').update(String(ip) + (process.env.JWT_SECRET || 'salt')).digest('hex').slice(0, 32);
}

router.post(
  '/track',
  trackLimiter,
  [
    body('visitor_id').isString().isLength({ min: 8, max: 64 }),
    body('session_id').isString().isLength({ min: 8, max: 64 }),
    body('path').isString().isLength({ min: 1, max: 500 }),
    body('referrer').optional({ nullable: true }).isString().isLength({ max: 500 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ua = req.headers['user-agent'] || '';
    const { visitor_id, session_id, path, referrer } = req.body;

    await pool.query(
      `INSERT INTO analytics_events (visitor_id, session_id, path, referrer, source, device, browser, os, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [visitor_id, session_id, path, referrer || null, sourceFromReferrer(referrer), detectDevice(ua), detectBrowser(ua), detectOS(ua), hashIp(req.ip)]
    );

    res.status(204).end();
  }
);

function rangeClause(range) {
  switch (range) {
    case '7d': return 'created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    case '30d': return 'created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    case '12m': return 'created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)';
    case 'all': return '1=1';
    default: return 'created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
  }
}

router.get('/summary', authenticate, authorize('superadmin', 'admin', 'editor'), query('range').optional().isIn(['7d', '30d', '12m', 'all']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const where = rangeClause(req.query.range);

  const [[totals]] = await pool.query(
    `SELECT COUNT(*) as pageviews, COUNT(DISTINCT visitor_id) as unique_visitors, COUNT(DISTINCT session_id) as sessions
     FROM analytics_events WHERE ${where}`
  );

  const [daily] = await pool.query(
    `SELECT DATE(created_at) as day, COUNT(*) as pageviews, COUNT(DISTINCT visitor_id) as visitors
     FROM analytics_events WHERE ${where} GROUP BY DATE(created_at) ORDER BY day ASC`
  );

  const [monthly] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as pageviews, COUNT(DISTINCT visitor_id) as visitors
     FROM analytics_events WHERE ${where} GROUP BY month ORDER BY month ASC`
  );

  const [topPages] = await pool.query(
    `SELECT path, COUNT(*) as views FROM analytics_events WHERE ${where} GROUP BY path ORDER BY views DESC LIMIT 15`
  );

  const [devices] = await pool.query(
    `SELECT device, COUNT(*) as count FROM analytics_events WHERE ${where} GROUP BY device`
  );

  const [sources] = await pool.query(
    `SELECT source, COUNT(*) as count FROM analytics_events WHERE ${where} GROUP BY source ORDER BY count DESC LIMIT 10`
  );

  const [browsers] = await pool.query(
    `SELECT browser, COUNT(*) as count FROM analytics_events WHERE ${where} GROUP BY browser ORDER BY count DESC`
  );

  res.json({ totals, daily, monthly, topPages, devices, sources, browsers });
});

router.get('/export.csv', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const where = rangeClause(req.query.range);
  const [rows] = await pool.query(
    `SELECT visitor_id, session_id, path, referrer, source, device, browser, os, created_at FROM analytics_events WHERE ${where} ORDER BY created_at DESC LIMIT 50000`
  );

  const header = 'visitor_id,session_id,path,referrer,source,device,browser,os,created_at\n';
  const csv = rows.map(r => [r.visitor_id, r.session_id, r.path, r.referrer || '', r.source, r.device, r.browser, r.os, r.created_at]
    .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics_export.csv"');
  res.send(header + csv);
});

module.exports = router;
