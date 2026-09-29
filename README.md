# Er. Kumar Abhishek — Portfolio + CMS (Phase 1)

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

## Known follow-ups
- `npm audit` flags moderate issues in `react-quill`'s bundled Quill (XSS in rich text rendering) and `react-router-dom` v6 (open-redirect edge case) — both only reachable via trusted admin input in this app, but worth upgrading in a later pass.
- Phase 2 (analytics, AI chatbot, CRM funnel dashboard) not yet started — see task list.
