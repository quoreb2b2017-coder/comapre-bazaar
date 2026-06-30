const path = require("path");

// Load .env BEFORE any module reads process.env (e.g. Cloudinary config on require)
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const blogAdminRoutes = require("./routes/blogAdmin.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

function parseCorsOrigins(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTrustProxy(value) {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return false;
  // express-rate-limit rejects permissive `true`; use hop count instead.
  if (v === "true" || v === "1" || v === "yes") return 1;
  if (v === "false" || v === "0" || v === "no") return false;
  const n = Number(v);
  if (Number.isFinite(n) && n >= 0) return n;
  return false;
}

app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

function normalizeOrigin(value) {
  return String(value || "").trim().replace(/\/$/, "");
}

/** Live site origins — browser blog-admin calls the API directly on Railway. */
const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.compare-bazaar.com",
  "https://compare-bazaar.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function isCompareBazaarHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  return host === "compare-bazaar.com" || host.endsWith(".compare-bazaar.com");
}

function buildAllowedOrigins() {
  const list = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_APP_URL,
    process.env.WEBSITE_URL,
    ...parseCorsOrigins(process.env.CORS_ORIGINS),
    ...DEFAULT_ALLOWED_ORIGINS,
  ]
    .map(normalizeOrigin)
    .filter(Boolean);
  return new Set(list);
}

const allowedOrigins = buildAllowedOrigins();

function isOriginAllowed(origin) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return true;

  if (allowedOrigins.has(normalized)) return true;

  try {
    const url = new URL(normalized);
    if (isCompareBazaarHost(url.hostname)) {
      return url.protocol === "https:" || process.env.NODE_ENV !== "production";
    }
  } catch {
    /* ignore malformed origin */
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      console.warn("[CORS] blocked origin:", origin);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Token", "Accept"],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/v1/blog-admin", blogAdminRoutes);
app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
