const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const unsplashKey = (process.env.UNSPLASH_ACCESS_KEY || "").trim();
if (unsplashKey) {
  console.log("[env] UNSPLASH_ACCESS_KEY loaded — blog generation will fetch topic covers");
} else {
  console.warn("[env] UNSPLASH_ACCESS_KEY not set — blog covers will use static fallbacks");
}

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

startServer();
