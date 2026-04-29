# Backend Setup (Node + Express + MongoDB + Cloudinary)

## 1) Install

```bash
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

## 3) Run

```bash
npm run dev
```

## API Endpoints (`/api/v1`)

- `GET /` health check
- `GET /api/v1/items` list items
- `GET /api/v1/items/:id` get one item
- `POST /api/v1/items` create item
- `PUT /api/v1/items/:id` update item
- `DELETE /api/v1/items/:id` delete item
- `POST /api/v1/upload` upload image (form-data key: `image`)

## Folder Pattern (MVC + Service Layer)

- `src/models` -> Mongoose models
- `src/controllers` -> HTTP layer only
- `src/services` -> business logic
- `src/routes` -> route composition
- `src/middlewares` -> cross-cutting concerns
- `src/utils` -> reusable helpers
