# Compare Bazaar - Full Stack Project

Compare Bazaar is a full-stack web project with:

- `client` -> Next.js 14 frontend
- `backend` -> Node.js + Express API (MVC + Service Layer)
- Database -> MongoDB
- Media storage -> Cloudinary

---

## Tech Stack

### Frontend (`client`)

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Web3Forms (lead form submissions)
- Google reCAPTCHA v2
- Anthropic API (chat assistant via `app/api/chat`)

### Backend (`backend`)

- Node.js
- Express 5
- MongoDB + Mongoose
- Cloudinary (image upload)
- Multer (multipart/form-data)

---

## Project Structure

```text
cc-final/
|-- client/
|   |-- app/
|   |-- components/
|   |-- data/
|   |-- lib/
|   `-- package.json
|
|-- backend/
|   |-- src/
|   |   |-- config/         # DB and Cloudinary config
|   |   |-- controllers/    # Request/response handlers
|   |   |-- middlewares/    # Error handling, upload middleware
|   |   |-- models/         # Mongoose schemas
|   |   |-- routes/         # Route definitions and composition
|   |   |-- services/       # Business logic layer
|   |   `-- utils/          # Shared helpers
|   |-- .env.example
|   `-- package.json
|
|-- .gitignore
`-- README.md
```

---

## Prerequisites

Install these before setup:

- Node.js 18+ (recommended 20 LTS)
- npm 9+
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account

---

## Local Setup (Step-by-Step)

## 1) Clone repository

```bash
git clone https://github.com/quoreb2b2017-coder/comapre-bazaar.git
cd comapre-bazaar
```

## 2) Setup backend

```bash
cd backend
npm install
```

Create `.env` from sample:

```bash
cp .env.example .env
```

Add values inside `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cc-final
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

Backend will run on:

- `http://localhost:5000`

## 3) Setup frontend

Open new terminal:

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local` and add:

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Frontend will run on:

- `http://localhost:3000`

---

## Frontend Feature Notes

### Dedicated quote forms (SEO routes)

The project now uses dedicated form pages (instead of only query-param based pages) for major software categories:

- Marketing:
  - `/marketing/best-crm-software/get-free-quote`
  - `/marketing/best-email-marketing-services/get-free-quotes`
  - `/marketing/best-website-building-platform/get-free-quotes`
- Technology:
  - `/technology/best-payroll-system/get-free-quotes`
  - `/technology/business-phone-systems/get-free-quotes`
  - `/technology/gps-fleet-management-software/get-free-quotes`
  - `/technology/best-employee-management-software/get-free-quotes`
- Sales:
  - `/sales/best-crm-software/get-free-quotes`
  - `/sales/best-call-center-management-software/get-free-quotes`
  - `/sales/best-project-management-software/get-free-quotes`

### Chat assistant

- Chat widget is mounted in `client/app/layout.tsx` via `CompareBazaarChat`.
- API endpoint: `POST /api/chat` (`client/app/api/chat/route.ts`)
- The route expects `ANTHROPIC_API_KEY` in `client/.env.local`.

---

## Backend API Documentation

Base URL:

- `http://localhost:5000/api/v1`

Health check:

- `GET /`

Item endpoints:

- `GET /api/v1/items` -> list all items
- `GET /api/v1/items/:id` -> get item by id
- `POST /api/v1/items` -> create item
- `PUT /api/v1/items/:id` -> update item
- `DELETE /api/v1/items/:id` -> delete item

Upload endpoint:

- `POST /api/v1/upload` -> upload image
  - Content-Type: `multipart/form-data`
  - Field name: `image`

### Example create item payload

```json
{
  "title": "Best CRM Software",
  "description": "Comparison content for CRM tools",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1/demo.jpg",
  "imagePublicId": "cc-final/demo"
}
```

---

## MVC + Clean Architecture Notes

Backend follows clean and scalable layering:

- `routes` -> define endpoints and map to controllers
- `controllers` -> parse request and return response
- `services` -> contain business logic and data operations
- `models` -> database schema
- `middlewares` -> cross-cutting logic (errors, uploads)
- `utils` -> reusable utilities (`ApiError`, async wrapper, response helpers)

This keeps code modular and easier to scale by feature/module.

---

## NPM Scripts

### Backend scripts

From `backend` directory:

- `npm run dev` -> start development server with nodemon
- `npm start` -> start production server

### Frontend scripts

From `client` directory:

- `npm run dev` -> start Next.js dev server
- `npm run build` -> production build
- `npm run start` -> start production server
- `npm run lint` -> lint project
- `npm run type-check` -> TypeScript type check

---

## Deployment Checklist

- Set all environment variables in hosting dashboard
- Use secure MongoDB URI
- Restrict Cloudinary keys and rotate if leaked
- Build frontend with `npm run build`
- Run backend with `npm start`
- Configure frontend environment to call backend base URL

---

## Troubleshooting

- If chat API returns authentication error:
  - verify `ANTHROPIC_API_KEY` in `client/.env.local`
  - restart dev server after env changes
- If Next build fails with stale manifest or module cache errors:
  - remove `client/.next`
  - rerun `npm run build`
- If backend fails with Mongo error:
  - verify `MONGODB_URI`
  - whitelist your IP in MongoDB Atlas
- If image upload fails:
  - verify Cloudinary credentials
  - ensure request is `multipart/form-data` with `image` field
- If port conflict happens:
  - change `PORT` in `backend/.env`

---

## Repository

GitHub:

- <https://github.com/quoreb2b2017-coder/comapre-bazaar>
