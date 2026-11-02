# Kroma Digital Media

Marketing website, lead/quote forms, and an admin dashboard UI for **Kroma
Digital Media** — "We Create. We Innovate. We Digitize."

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS and Framer
Motion, following the premium dark/glassmorphism brief: audio-visual, web,
mobile, software, AI and digital-transformation services, positioned at the
intersection of media, technology, software and AI.

## Structure

- `app/(site)/` — public marketing site (Home, About, Services, Solutions,
  AI Solutions, Portfolio + case studies, Industries, Contact, Request a
  Quote, Insights/blog, legal pages). Has its own layout with the nav/footer.
- `app/admin/` — admin dashboard UI (Overview, Contact Leads, Quote
  Requests, Portfolio/Services/Testimonials/Content/Media management,
  Website Settings). Separate layout (sidebar, no public nav), `noindex`.
- `app/api/contact`, `app/api/quote` — form submission endpoints. They
  validate input and log the submission; wire up a real database/CRM/email
  notification service before relying on them in production.
- `components/` — shared UI (nav, footer, hero visual, cards, animated
  backgrounds, form controls) and `components/admin/` (sidebar, stat cards,
  charts, status badges).
- `lib/data/` — all site content as typed data (services, solutions, AI
  features, industries, process steps, portfolio projects, blog posts, form
  options) plus `lib/data/admin.ts` mock dashboard data. Swap these for real
  data sources without touching page markup.
- `lib/validation.ts` — shared client/server form validation.

## Local setup

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
npm run lint                      # eslint (flat config)
```

## Content & demo data

- Portfolio projects (`lib/data/portfolio.ts`) and blog posts
  (`lib/data/blog.ts`) are clearly-marked **demo content** — swap in real
  Kroma Digital Media case studies and articles.
- The admin dashboard (`lib/data/admin.ts`) uses mock leads, quote requests
  and stats so the UI can be reviewed before a backend exists.

## Known follow-ups / next steps

- **Backend**: `app/api/contact` and `app/api/quote` currently validate and
  log submissions only. Connect a database (the brief suggests
  PostgreSQL), CRM, and email/WhatsApp notifications.
- **Auth**: the admin dashboard UI has no authentication yet — add a login
  gate before deploying it anywhere public.
- **CMS**: Portfolio, Services, Testimonials and Blog/Articles admin pages
  are UI shells over the static data files above; connect them to a real
  data store (and the content APIs) to make them actually editable.
- **Media**: quote-form attachments are accepted client-side but not
  uploaded anywhere yet — wire up cloud object storage.
- **Favicon**: `app/icon.svg` provides the tab icon; add a dedicated
  `favicon.ico`/PNG set if you need legacy favicon support.
- **Domain/SEO**: `metadataBase`, Open Graph/Twitter metadata, the JSON-LD
  Organization/WebSite/Article schema, `app/sitemap.ts` and `app/robots.ts`
  all currently point at the placeholder `https://www.kromadigitalmedia.com`
  — update once the real domain is set.
