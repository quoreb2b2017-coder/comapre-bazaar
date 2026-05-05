const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const blogAdminRoutes = require("./routes/blogAdmin.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

// Always load backend/.env even if `node` was started from repo root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

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
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  const n = Number(v);
  if (Number.isFinite(n) && n >= 0) return n;
  return value;
}

app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_APP_URL,
    ...parseCorsOrigins(process.env.CORS_ORIGINS),
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and local tools without Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
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
