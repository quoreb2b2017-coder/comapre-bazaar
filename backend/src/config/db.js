const dns = require("dns");
const mongoose = require("mongoose");

// Some Windows resolvers refuse MongoDB Atlas SRV lookups; prefer public DNS.
try {
  const servers = dns.getServers();
  if (!servers.includes("8.8.8.8")) {
    dns.setServers(["8.8.8.8", "1.1.1.1", ...servers]);
  }
} catch {
  /* ignore */
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  await mongoose.connect(mongoURI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
