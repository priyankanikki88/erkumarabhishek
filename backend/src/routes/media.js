const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  'image/jpeg': 'image', 'image/png': 'image', 'image/webp': 'image', 'image/gif': 'image',
  'video/mp4': 'video', 'video/webm': 'video',
  'application/pdf': 'pdf'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_UPLOAD_MB, 10) || 25) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) return cb(new Error('Unsupported file type'));
    cb(null, true);
  }
});

router.post('/upload', authenticate, authorize('superadmin', 'admin', 'editor'), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const kind = ALLOWED[req.file.mimetype] || 'other';
  const url = `/uploads/${req.file.filename}`;

  const [result] = await pool.query(
    'INSERT INTO media (filename, url, mime_type, kind, size_bytes, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.file.filename, url, req.file.mimetype, kind, req.file.size, req.body.alt_text || null, req.user.id]
  );

  await logAudit(req, 'upload_media', 'media', result.insertId, { filename: req.file.filename });
  res.status(201).json({ id: result.insertId, url, kind, filename: req.file.filename });
});

router.get('/', authenticate, async (req, res) => {
  const { kind } = req.query;
  let sql = 'SELECT * FROM media WHERE 1=1';
  const params = [];
  if (kind) { sql += ' AND kind = ?'; params.push(kind); }
  sql += ' ORDER BY created_at DESC LIMIT 500';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.delete('/:id', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM media WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });

  const filePath = path.join(UPLOAD_DIR, rows[0].filename);
  fs.unlink(filePath, () => {});

  await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);
  await logAudit(req, 'delete_media', 'media', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
