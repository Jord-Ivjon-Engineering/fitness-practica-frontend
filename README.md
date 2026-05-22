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
| `VITE_API_URL` | Yes | Base URL of your backend API |
| `VITE_TELEGRAM_BOT_USERNAME` | No | Telegram bot username for login/deep links, if used |

## Local development

```
npm install
npm run dev
```

## Backend

Deploy the server from the full Fitness Practica project elsewhere and point `VITE_API_URL` at that deployment.
