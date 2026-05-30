# Fitness Practica — Frontend (Netlify)

This repository contains **only** the Vite + React frontend for Fitness Practica. The API/backend must be hosted separately.

## Netlify

Settings are defined in `netlify.toml`:

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

Connect this repo in Netlify, then deploy. SPA routing uses `public/_redirects` and matching rules in `netlify.toml`.

## Environment variables

Set in Netlify **Site settings → Environment variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Base URL of your backend API (only needed if using data APIs) |
| `VITE_TELEGRAM_BOT_USERNAME` | No | Telegram bot username for login/deep links, if used |

## Authentication

Login and signup run **entirely in the browser** — no backend auth is required. Users are stored in `localStorage` under `fp_users`. Every logged-in user has the **admin** role.

1. Sign up at `/signup`
2. Sign in at `/login` with the same email and password
3. You are redirected to the admin dashboard

## Admin dashboard (mock data)

When `VITE_API_URL` is **not** set, the admin dashboard uses mock data stored in `localStorage` (`fp_admin_mock`). Set `VITE_USE_MOCK_DATA=true` to force mock mode even if an API URL is configured.

## Local development

```
npm install
npm run dev
```

## Backend

Deploy the server from the full Fitness Practica project elsewhere and point `VITE_API_URL` at that deployment.
