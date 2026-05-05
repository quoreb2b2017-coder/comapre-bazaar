# Backend API README

Complete backend API reference for this project.

## Base URLs

- App root: `http://localhost:5000`
- Versioned API: `http://localhost:5000/api/v1`
- Blog admin API: `http://localhost:5000/api/v1/blog-admin`

## Setup

1) Install dependencies

```bash
npm install
```

2) Copy env file

```bash
cp .env.example .env
```

3) Run server

```bash
npm run dev
```

## Deploy on Railway

1. Create a new Railway service from this repo and set the service root directory to `backend`.
2. Railway will use `backend/railway.json` and run `npm start`.
3. Add these required Railway variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `FRONTEND_URL`
4. Add optional variables only if you use those features:
   - `ANTHROPIC_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `WEBSITE_URL`
   - `WEBSITE_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. After first deploy, copy your Railway public URL and set:
   - `BACKEND_PUBLIC_URL=https://your-service.up.railway.app`
   - `PUBLIC_API_URL=https://your-service.up.railway.app`
   - `TRUST_PROXY=true`
6. Redeploy and verify:

```bash
GET /api/v1/blog-admin/health
```

### Railway notes

- CORS now accepts `FRONTEND_URL`, `FRONTEND_APP_URL`, and comma-separated `CORS_ORIGINS`.
- Telegram webhook setup needs a public HTTPS backend URL, so use your Railway domain in `BACKEND_PUBLIC_URL` / `PUBLIC_API_URL`.
- Keep real secrets in Railway variables only; `backend/.env.example` is just a template.

## Auth Notes

- Blog admin protected endpoints use JWT auth middleware (`protect`).
- Send auth token in `Authorization: Bearer <token>`.
- Public endpoints are marked as public below.

## Global Endpoints

### Health

- `GET /`
  - Description: API health check
  - Auth: Public

## Core API (`/api/v1`)

### Items

- `GET /api/v1/items`
  - Description: List items
  - Auth: Public

- `POST /api/v1/items`
  - Description: Create item
  - Auth: Public

- `GET /api/v1/items/:id`
  - Description: Get single item by id
  - Auth: Public

- `PUT /api/v1/items/:id`
  - Description: Update item by id
  - Auth: Public

- `DELETE /api/v1/items/:id`
  - Description: Delete item by id
  - Auth: Public

### Upload

- `POST /api/v1/upload`
  - Description: Upload image
  - Auth: Public
  - Content type: `multipart/form-data`
  - File field: `image`

## Blog Admin API (`/api/v1/blog-admin`)

### Admin Service Health

- `GET /api/v1/blog-admin/health`
  - Description: Blog admin API health
  - Auth: Public

### Telegram Webhook and Controls

- `POST /api/v1/blog-admin/telegram/webhook`
  - Description: Telegram callback webhook receiver
  - Auth: Public

- `POST /api/v1/blog-admin/telegram/configure-webhook`
  - Description: Configure Telegram webhook URL
  - Auth: Protected

- `GET /api/v1/blog-admin/telegram/webhook-status`
  - Description: Get Telegram webhook status/info
  - Auth: Protected

- `POST /api/v1/blog-admin/telegram/delete-webhook`
  - Description: Delete Telegram webhook
  - Auth: Protected

### Auth

- `POST /api/v1/blog-admin/auth/request-otp`
  - Description: Request login OTP
  - Auth: Public
  - Body: `{ "email": "admin@example.com" }`

- `POST /api/v1/blog-admin/auth/verify-otp`
  - Description: Verify OTP and issue JWT
  - Auth: Public
  - Body: `{ "email": "admin@example.com", "otp": "123456" }`

- `GET /api/v1/blog-admin/auth/me`
  - Description: Current admin profile
  - Auth: Protected

- `POST /api/v1/blog-admin/auth/logout`
  - Description: Logout endpoint (stateless response)
  - Auth: Protected

### Blog Generation

- `POST /api/v1/blog-admin/generate-blog/validate-key`
  - Description: Validate Claude API key
  - Auth: Protected

- `POST /api/v1/blog-admin/generate-blog`
  - Description: Generate blog content via Claude
  - Auth: Protected
  - Body: `{ "topic": "...", "keywords": [], "tone": "professional|casual|seo-optimized", "customInstructions": "", "saveAsDraft": false }`

- `POST /api/v1/blog-admin/generate-blog/save`
  - Description: Save blog draft manually
  - Auth: Protected

### Blog Management

- `GET /api/v1/blog-admin/blogs`
  - Description: List blogs with filters and pagination
  - Auth: Protected
  - Query: `status, search, page, limit, sortBy, sortOrder, dateFrom, dateTo`

- `GET /api/v1/blog-admin/blogs/stats`
  - Description: Blog stats and recent activity
  - Auth: Protected

- `GET /api/v1/blog-admin/blogs/:id`
  - Description: Get blog by id
  - Auth: Protected

- `PUT /api/v1/blog-admin/blogs/:id`
  - Description: Update editable blog fields
  - Auth: Protected

- `DELETE /api/v1/blog-admin/blogs/:id`
  - Description: Delete blog by id
  - Auth: Protected

- `POST /api/v1/blog-admin/blogs/:id/approve`
  - Description: Approve pending blog
  - Auth: Protected

- `POST /api/v1/blog-admin/blogs/:id/reject`
  - Description: Reject blog with optional reason
  - Auth: Protected
  - Body: `{ "reason": "..." }` (optional)

- `POST /api/v1/blog-admin/blogs/:id/publish`
  - Description: Publish approved blog
  - Auth: Protected

- `POST /api/v1/blog-admin/blogs/:id/send-approval`
  - Description: Send approval notification
  - Auth: Protected
  - Body: `{ "via": "telegram|email|both" }`

### Trends Assistant

- `POST /api/v1/blog-admin/trends-chat`
  - Description: Trends assistant chat response
  - Auth: Protected
  - Body: `{ "messages": [{ "role": "user|assistant", "content": "..." }] }`

### Settings

- `GET /api/v1/blog-admin/settings`
  - Description: Get dashboard settings
  - Auth: Protected

- `PUT /api/v1/blog-admin/settings`
  - Description: Save dashboard settings
  - Auth: Protected
  - Body: `{ "settings": { "key": "value" } }`

- `POST /api/v1/blog-admin/settings/test-telegram`
  - Description: Send Telegram test message
  - Auth: Protected

- `POST /api/v1/blog-admin/settings/test-email`
  - Description: Send email test via Resend
  - Auth: Protected

### Public Blog Endpoints (No Auth)

- `GET /api/v1/blog-admin/public/blogs`
  - Description: Public blog listing (approved and published)
  - Auth: Public

- `GET /api/v1/blog-admin/public/blogs/:slug`
  - Description: Public blog details by slug
  - Auth: Public

- `POST /api/v1/blog-admin/public/blogs/:slug/view`
  - Description: Increment public view counter
  - Auth: Public

### Public Site Analytics (No Auth)

- `POST /api/v1/blog-admin/public/site-analytics/event`
  - Description: Ingest analytics event (`page_view` or `consent`)
  - Auth: Public

### Site Analytics Admin Report

- `GET /api/v1/blog-admin/site-analytics/report`
  - Description: Full analytics report for dashboard
  - Auth: Protected

## Rate Limiting

- Blog admin router general limit: 300 requests per 15 minutes.
- OTP request endpoint has tighter limit.
- Public site analytics ingest endpoint has per-minute limit.

## Folder Structure

- `src/routes`: Express route modules
- `src/controllers`: Controller handlers
- `src/services`: Business logic and integrations
- `src/models`: Mongoose models
- `src/middlewares`: Auth, upload, error handlers
- `src/config`: DB and provider config
