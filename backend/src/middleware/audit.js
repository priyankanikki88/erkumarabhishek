const pool = require('../config/db');

async function logAudit(req, action, entity, entityId, details = {}) {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user?.id || null, action, entity, entityId || null, JSON.stringify(details), req.ip]
    );
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}

module.exports = { logAudit };
