# Viber Bot Backend

This is a secure, cross-platform-ready backend for managing Viber bot operations via fake tokens.
It hides the real Viber bot token and offers controlled access using JWT tokens with scopes.

## Features

- JWT-based fake token issuing
- Bot update endpoint (name/avatar)
- Secure Viber API interaction
- Access control via scopes
- Multi-platform-ready architecture
- Ready to deploy on Render

## Endpoints

### POST `/api/v1/token`
Issue a fake token.
```json
{
  "clientId": "client-app-id",
  "scopes": ["update_bot_info"],
  "allowedPlatforms": ["viber"]
}
```

### POST `/api/v1/bot/update`
Update Viber bot info.
```json
{
  "name": "MyBot",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Requires:** Authorization header with Bearer token.

---

## Local Development

1. Rename `.env.example` to `.env`
2. Fill in your `REAL_VIBER_BOT_TOKEN` and `JWT_SECRET`
3. Run:
```bash
npm install
npm start
```

---

## Render Deployment

### Step-by-step

1. Push this repo to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com)
3. Click **New Web Service** → **Deploy from a Git repository**
4. Select this repo and branch (e.g., `main`).
5. Render will detect the `render.yaml` and set up:
   - Environment variables
   - Build/start commands
6. Click **Deploy**

### Required Environment Variables

Set these in Render (or through `render.yaml`):

- `REAL_VIBER_BOT_TOKEN`
- `JWT_SECRET`
- `PORT` (optional, defaults to 3000)

---

## Next Steps

- Add webhook support to receive bot events.
- Add a client UI for token generation.
- Expand `platformAdapter.js` for WhatsApp, Telegram, etc.