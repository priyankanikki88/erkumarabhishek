const pool = require('../config/db');

function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function buildKnowledgeBase(maxChars = 12000) {
  const [content] = await pool.query(
    `SELECT type, title, excerpt, body FROM content WHERE status = 'published' ORDER BY type, order_index`
  );
  const [products] = await pool.query(
    `SELECT name, description, specifications, price FROM products WHERE status = 'published'`
  );

  let text = '';
  for (const c of content) {
    text += `\n[${c.type}] ${c.title}\n${c.excerpt || ''}\n${stripHtml(c.body).slice(0, 800)}\n`;
    if (text.length > maxChars) break;
  }
  for (const p of products) {
    if (text.length > maxChars) break;
    let specs = '';
    try {
      const s = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      if (s) specs = Object.entries(s).map(([k, v]) => `${k}: ${v}`).join(', ');
    } catch (_) {}
    text += `\n[product] ${p.name}${p.price ? ` (₹${p.price})` : ''}\n${p.description || ''}\n${specs}\n`;
  }

  return text.slice(0, maxChars);
}

module.exports = { buildKnowledgeBase, stripHtml };
