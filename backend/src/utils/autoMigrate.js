const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function autoMigrate() {
  const dir = path.join(__dirname, '..', '..', 'migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`[migrate] applying ${file}`);
    await conn.query(sql);
  }
  await conn.end();

  const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM users');
  if (count === 0 && process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "superadmin")',
      [process.env.SEED_ADMIN_NAME || 'Admin', process.env.SEED_ADMIN_EMAIL, hash]
    );
    console.log(`[migrate] seeded initial superadmin: ${process.env.SEED_ADMIN_EMAIL}`);
  }
}

module.exports = { autoMigrate };
