# Deployment — Hostinger (www.erkumarabhishek.com)

Node.js backend + MySQL, React frontend built as static files. No PHP used.

## Prerequisites on Hostinger
1. hPanel plan with **Node.js App** support (Business/Cloud/VPS). Shared "Premium" plans without Node.js cannot run the backend.
2. hPanel → **Databases → MySQL Databases**: create a database + user, note host/name/user/password.
3. hPanel → **Advanced → SSH Access**: enable, note host/port/username.

## 1. Backend deploy (Node.js App in hPanel)
1. hPanel → **Advanced → Node.js** → Create Application.
   - Application root: `erkumarabhishek/backend`
   - Application URL: `api.erkumarabhishek.com` (add this subdomain in hPanel first) or a `/api` proxy path.
   - Startup file: `src/server.js`
   - Node version: 18+
2. Upload the `backend/` folder via Git (SSH) or File Manager (excluding `node_modules`, `.env`, `uploads/*`).
3. SSH in and run:
   ```
   cd ~/erkumarabhishek/backend
   npm install --omit=dev
   cp .env.example .env   # then edit with real DB creds, JWT secret, etc.
   npm run migrate
   npm run seed            # creates the first superadmin from .env values
   ```
4. In hPanel Node.js app screen, click **Restart**.
5. Confirm: `curl https://api.erkumarabhishek.com/api/health`

## 2. Frontend deploy (static React build)
1. Locally or via SSH:
   ```
   cd frontend
   npm install
   echo "VITE_WHATSAPP_NUMBER=91XXXXXXXXXX" > .env
   npm run build
   ```
2. Upload the contents of `frontend/dist/` to `public_html/` (the domain's web root) via File Manager or FTP.
3. Add `public_html/.htaccess` for SPA routing:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. Point API calls: since the frontend calls relative `/api/...`, either
   - set up a reverse proxy from `www.erkumarabhishek.com/api` → the Node app (via hPanel subdomain proxy / `.htaccess` ProxyPass if mod_proxy is available), **or**
   - simplest: change `frontend/src/api/client.js` `baseURL` to `https://api.erkumarabhishek.com/api` and rebuild, then also add that origin to backend `CLIENT_URL` for CORS.

## 3. DNS
- `www.erkumarabhishek.com` → A/CNAME to Hostinger hosting (already likely set).
- `api.erkumarabhishek.com` → point to the Node.js app per hPanel instructions (usually automatic when you create the subdomain in hPanel).
- Enable free SSL (Let's Encrypt) for both in hPanel → SSL.

## 4. Post-deploy checklist
- [ ] `/api/health` returns `{ok:true}`
- [ ] Admin login works at `/admin/login` with seeded credentials — **change the seed password immediately after first login is not yet a self-service feature; rotate by creating a new admin user via `/api/auth/users` and deactivating the seed account in DB if needed.**
- [ ] Contact form submission appears in Admin → Messages and Leads
- [ ] Image/PDF upload works and files are reachable at `/uploads/...`
- [ ] WhatsApp float button opens chat with correct number (set `VITE_WHATSAPP_NUMBER`)

## Credentials needed from you before I can deploy
- Hostinger SSH host, port, username, and password or SSH key
- MySQL database name, username, password (from hPanel)
- WhatsApp business number for the floating button
- Confirmation that Node.js hosting is available on your current Hostinger plan (VPS/Business/Cloud), since shared Premium/Basic plans do not support Node.js apps — a PHP-free stack cannot run backend logic there.
