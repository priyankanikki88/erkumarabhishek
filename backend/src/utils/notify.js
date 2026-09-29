const pool = require('../config/db');

async function notify(type, title, body, link = null) {
  try {
    await pool.query(
      'INSERT INTO notifications (type, title, body, link) VALUES (?, ?, ?, ?)',
      [type, title, body || null, link]
    );
  } catch (err) {
    console.error('Notification failed:', err.message);
  }
}

module.exports = { notify };
