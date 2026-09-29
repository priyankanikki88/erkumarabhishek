const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const { notify } = require('../utils/notify');
const { buildKnowledgeBase } = require('../utils/knowledgeBase');

const router = express.Router();

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { error: 'Too many messages, slow down.' } });

async function getSettings() {
  const [rows] = await pool.query('SELECT * FROM chatbot_settings WHERE id = 1');
  return rows[0];
}

router.get('/settings/public', async (req, res) => {
  const s = await getSettings();
  if (!s) return res.json({ enabled: false });
  res.json({
    enabled: !!s.enabled,
    greeting_message: s.greeting_message,
    lead_capture_enabled: !!s.lead_capture_enabled,
    whatsapp_handoff_enabled: !!s.whatsapp_handoff_enabled
  });
});

router.get('/settings', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  res.json(await getSettings());
});

router.put('/settings', authenticate, authorize('superadmin', 'admin'), async (req, res) => {
  const { enabled, greeting_message, system_prompt, model, lead_capture_enabled, whatsapp_handoff_enabled } = req.body;
  const existing = await getSettings();
  await pool.query(
    `UPDATE chatbot_settings SET enabled = ?, greeting_message = ?, system_prompt = ?, model = ?, lead_capture_enabled = ?, whatsapp_handoff_enabled = ?, updated_by = ? WHERE id = 1`,
    [
      enabled ?? existing.enabled, greeting_message ?? existing.greeting_message, system_prompt ?? existing.system_prompt,
      model ?? existing.model, lead_capture_enabled ?? existing.lead_capture_enabled,
      whatsapp_handoff_enabled ?? existing.whatsapp_handoff_enabled, req.user.id
    ]
  );
  await logAudit(req, 'update_chatbot_settings', 'chatbot_settings', 1);
  res.json(await getSettings());
});

async function getOrCreateConversation(sessionId, visitorId) {
  const [rows] = await pool.query('SELECT * FROM chatbot_conversations WHERE session_id = ? AND visitor_id = ? ORDER BY id DESC LIMIT 1', [sessionId, visitorId]);
  if (rows[0]) return rows[0];
  const [result] = await pool.query('INSERT INTO chatbot_conversations (session_id, visitor_id) VALUES (?, ?)', [sessionId, visitorId]);
  const [created] = await pool.query('SELECT * FROM chatbot_conversations WHERE id = ?', [result.insertId]);
  return created[0];
}

router.post(
  '/message',
  chatLimiter,
  [
    body('session_id').isString().isLength({ min: 8, max: 64 }),
    body('visitor_id').isString().isLength({ min: 8, max: 64 }),
    body('message').isString().trim().isLength({ min: 1, max: 2000 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const settings = await getSettings();
    if (!settings || !settings.enabled) return res.status(403).json({ error: 'Chatbot is currently disabled' });

    const { session_id, visitor_id, message } = req.body;
    const conversation = await getOrCreateConversation(session_id, visitor_id);

    await pool.query('INSERT INTO chatbot_messages (conversation_id, role, content) VALUES (?, "user", ?)', [conversation.id, message]);
    await pool.query('UPDATE chatbot_conversations SET last_message_at = NOW() WHERE id = ?', [conversation.id]);

    if (!process.env.OPENAI_API_KEY) {
      const fallback = "I'm not fully set up yet — the site admin needs to add an AI API key. In the meantime, please use the contact form or WhatsApp button and I'll make sure your message gets through.";
      await pool.query('INSERT INTO chatbot_messages (conversation_id, role, content) VALUES (?, "assistant", ?)', [conversation.id, fallback]);
      return res.json({ conversation_id: conversation.id, reply: fallback, ai_configured: false });
    }

    try {
      const [history] = await pool.query(
        'SELECT role, content FROM chatbot_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 10',
        [conversation.id]
      );
      const knowledge = await buildKnowledgeBase();

      const systemPrompt = `${settings.system_prompt || 'You are a helpful assistant for a professional portfolio website. Answer questions using only the knowledge base below. Be concise and friendly. If asked something outside the knowledge base, say you do not have that information and suggest contacting via the contact form or WhatsApp. If the visitor shows interest in services/products, politely ask if they would like to share their name, phone, email, location and requirement so the team can follow up.'}\n\nKNOWLEDGE BASE:\n${knowledge}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.reverse().map(m => ({ role: m.role, content: m.content }))
      ];

      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: settings.model || 'gpt-4o-mini', messages, temperature: 0.4, max_tokens: 400 })
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        throw new Error(`AI API error: ${aiRes.status} ${errText.slice(0, 200)}`);
      }

      const data = await aiRes.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response. Please try again.";

      await pool.query('INSERT INTO chatbot_messages (conversation_id, role, content) VALUES (?, "assistant", ?)', [conversation.id, reply]);
      res.json({ conversation_id: conversation.id, reply, ai_configured: true });
    } catch (err) {
      console.error('Chatbot AI error:', err.message);
      const fallback = 'I ran into an issue answering that just now. Please try again shortly, or use the contact form / WhatsApp button.';
      await pool.query('INSERT INTO chatbot_messages (conversation_id, role, content) VALUES (?, "assistant", ?)', [conversation.id, fallback]);
      res.json({ conversation_id: conversation.id, reply: fallback, ai_configured: true, error: true });
    }
  }
);

router.post(
  '/lead',
  chatLimiter,
  [
    body('session_id').isString().isLength({ min: 8, max: 64 }),
    body('visitor_id').isString().isLength({ min: 8, max: 64 }),
    body('name').isString().trim().isLength({ min: 2, max: 160 }),
    body('consent').custom(v => v === true || v === 'true').withMessage('Consent is required'),
    body('email').optional({ nullable: true }).isEmail(),
    body('phone').optional({ nullable: true }).isString().isLength({ max: 40 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { session_id, visitor_id, name, phone, email, location, requirement } = req.body;
    const conversation = await getOrCreateConversation(session_id, visitor_id);

    const [result] = await pool.query(
      'INSERT INTO leads (name, phone, email, location, requirement, source, consent) VALUES (?, ?, ?, ?, ?, "chatbot", 1)',
      [name, phone || null, email || null, location || null, requirement || null]
    );

    await pool.query('UPDATE chatbot_conversations SET lead_id = ? WHERE id = ?', [result.insertId, conversation.id]);
    await notify('new_lead', 'New chatbot lead', `${name} submitted their details via the AI chatbot`, '/admin/leads');

    res.status(201).json({ ok: true, lead_id: result.insertId });
  }
);

// ADMIN: conversation history
router.get('/conversations', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, l.name as lead_name,
     (SELECT content FROM chatbot_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) as last_message
     FROM chatbot_conversations c LEFT JOIN leads l ON l.id = c.lead_id
     ORDER BY c.last_message_at DESC LIMIT 200`
  );
  res.json(rows);
});

router.get('/conversations/:id', authenticate, authorize('superadmin', 'admin', 'editor'), async (req, res) => {
  const [messages] = await pool.query('SELECT * FROM chatbot_messages WHERE conversation_id = ? ORDER BY id ASC', [req.params.id]);
  res.json(messages);
});

module.exports = router;
