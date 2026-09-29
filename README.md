# Er. Kumar Abhishek — Portfolio + CMS + Analytics + AI Chatbot

Stack: React (Vite) frontend, Node.js/Express backend, MySQL. No PHP.

## Structure
- `backend/` — Express API, JWT auth, MySQL, file uploads
- `frontend/` — React public site + Admin CMS panel
- `backend/migrations/001_init.sql` — DB schema
- `DEPLOY.md` — Hostinger deployment steps

## Local setup
```
# Backend
cd backend
cp .env.example .env   # fill in DB creds, JWT secret, admin seed
npm install
npm run migrate
npm run seed
npm run dev             # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Phase 1 — implemented
- Public site: Home, About, Journey, Education, Experience, Skills, Certifications, Projects, Products, Services, Articles, Blog, Marketing, Gallery, Contact
- Admin login (JWT, httpOnly cookie + bearer), roles: superadmin/admin/editor
- CMS: create/edit/delete, draft/publish/unpublish, preview, SEO fields, version history + restore
- Rich text editor (Quill), media library (image/video/PDF upload), product catalog with categories/specs/brochures/images
- Contact form → stored + auto-creates a CRM lead
- Audit log, rate limiting, helmet, input validation, bcrypt password hashing
- Floating WhatsApp button

Tested end-to-end against a live MySQL instance: auth, content CRUD + publish + versioning, media upload, product+category+media linking, public endpoints, contact→lead capture, dashboard summary, role/validation guards.

## Phase 2 — implemented
- Visitor analytics: pageview tracking (visitor/session cookies), daily/monthly traffic, unique visitors, sessions, top pages, device/browser/source breakdown, date-range filter, CSV export
- AI chatbot: floating widget on public site, RAG grounded in published content + products (`buildKnowledgeBase`), uses `OPENAI_API_KEY` if configured, graceful fallback message if not
- Chatbot lead capture with explicit consent checkbox → creates CRM lead (source `chatbot`)
- WhatsApp handoff button inside chat, prefilled with the visitor's last message
- CRM: lead detail page with status, activity timeline (notes/calls/emails/follow-ups), conversion funnel chart, lead sources
- AI conversation history viewer (admin) + configurable chatbot settings (greeting, system prompt, model, toggles)
- Admin notifications bell (new leads/messages), dedicated audit log viewer

Tested end-to-end against a live MySQL instance: analytics tracking + summary aggregation, chatbot message flow (fallback path, since no OpenAI key is configured in this environment) + lead capture + conversation history, lead activities/funnel, notifications, chatbot settings update, CSV export.

## Known follow-ups
- `npm audit` flags moderate issues in `react-quill`'s bundled Quill (XSS in rich text rendering) and `react-router-dom` v6 (open-redirect edge case) — both only reachable via trusted admin input in this app, but worth upgrading in a later pass.
- AI replies are untested against the real OpenAI API in this environment because no `OPENAI_API_KEY` was provided — the fallback path (chatbot disabled/unconfigured messaging) was verified instead. Add a real key to `backend/.env` and retest the `/api/chatbot/message` endpoint before relying on it in production.
- Visitor **location** (country/city) is not populated — no geo-IP provider is wired up (avoided adding a third-party dependency/key without your sign-off). Devices/browsers/sources are fully live.
