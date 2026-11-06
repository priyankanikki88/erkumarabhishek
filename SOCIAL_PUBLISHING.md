# Social Publisher — post once, publish to Facebook, Instagram & YouTube

Admin → **Social Publisher** lets you connect your Facebook Page, its linked
Instagram Business account, and a YouTube channel, then compose one post
(caption + photo/video) and publish it to all of them in a single click.
"Reels" and YouTube Shorts are handled as a **post type** (Photo / Video /
Reel), not as separate platforms — a Reel targets Facebook's and Instagram's
Reels endpoints, while YouTube simply receives the same video as an upload.

## What you need before connecting anything

Each platform requires its own developer app and, for real public use,
Meta's **App Review** (Facebook/Instagram) — without it, publishing only
works for accounts added as "testers" on your app. Budget a few days for
review once you're ready to go live with real end users.

### 1. Facebook + Instagram (one connection covers both)

1. Create an app at [developers.facebook.com](https://developers.facebook.com/) → **My Apps → Create App → Business**.
2. Add the **Facebook Login** product. Under its settings, add this Valid OAuth Redirect URI:
   `https://YOUR_DOMAIN/api/social/callback/facebook`
3. Add the **Instagram Graph API** product (comes with Business apps).
4. Your Instagram account must be a **Business or Creator account**, linked
   to a **Facebook Page** you manage (Instagram app → Settings → Linked Accounts).
5. Request these permissions (Facebook App Review, or add yourself/your
   team as a Tester under **Roles** to test before review):
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`,
   `business_management`, `instagram_basic`, `instagram_content_publish`.
6. Copy the **App ID** and **App Secret** from Settings → Basic into
   `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`.

### 2. YouTube (Google Cloud)

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3** (APIs & Services → Library).
3. Configure the **OAuth consent screen** (External, add your account as a
   Test User while unverified — verification is required before unlimited
   public use since the `youtube.upload` scope is "restricted").
4. Create an **OAuth 2.0 Client ID** (Web application) with this redirect URI:
   `https://YOUR_DOMAIN/api/social/callback/youtube`
5. Copy the **Client ID** and **Client Secret** into `GOOGLE_CLIENT_ID` /
   `GOOGLE_CLIENT_SECRET`.

## Environment variables (`backend/.env`)

```
PUBLIC_BASE_URL=https://www.erkumarabhishek.com   # used to build OAuth redirect URIs and media URLs Meta fetches
SOCIAL_TOKEN_SECRET=<32+ random chars>             # encrypts stored access/refresh tokens at rest
GRAPH_API_VERSION=v21.0                            # bump periodically — Meta retires old versions
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`FACEBOOK_REDIRECT_URI` / `GOOGLE_REDIRECT_URI` are optional overrides —
by default they're derived from `PUBLIC_BASE_URL`.

Run the new migration (or just restart the app — `autoMigrate` applies any
new `.sql` file in `backend/migrations/` automatically on boot):

```
cd backend
npm run migrate
```

## Using it

1. Admin → **Social Publisher** → **Connect Facebook & Instagram** (one
   Facebook login also links any Instagram Business account attached to
   the Pages you authorize) and/or **Connect YouTube**.
2. Pick a post type, write a caption, choose media from the Media Library
   (skip media for a Facebook text-only post), tick which connected
   accounts to publish to, and click **Publish Everywhere**.
3. Each platform's result (success/failed, with a link or error message)
   shows per-post in **Post History**. A partially failed post can be
   **retried** — only the failed platforms are attempted again.

## Known limitations

- **No background queue**: publishing runs inline while you wait on the
  "Publish Everywhere" click. A YouTube upload of a large file can take a
  while — the request stays open until every platform responds.
- **Compatibility rules are enforced automatically**: YouTube only accepts
  Video/Reel (no photos, no text-only); Instagram requires media (no
  text-only posts). Incompatible accounts are disabled in the composer.
- **Instagram/Facebook need a publicly reachable media URL** — `PUBLIC_BASE_URL`
  must point at your real deployed domain (not `localhost`) since Meta's
  servers fetch the image/video from `${PUBLIC_BASE_URL}${media.url}`.
- **YouTube quota**: a single upload costs ~1600 of the default 10,000
  daily quota units — roughly 6 uploads/day unless you request a quota
  increase from Google.
- **Facebook Page access tokens** obtained this way don't have a fixed
  expiry in practice, but can be invalidated if the connecting user's
  password changes or they remove the app's access — reconnect if a post
  starts failing with an auth error. **YouTube** access tokens refresh
  automatically from the stored refresh token; if Google revokes it,
  reconnect that channel.
- Review access (`instagram_content_publish`, Facebook's `pages_manage_posts`)
  is required from Meta before this works for any account beyond your
  app's registered Testers.
