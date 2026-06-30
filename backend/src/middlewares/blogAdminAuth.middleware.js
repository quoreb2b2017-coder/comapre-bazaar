const jwt = require("jsonwebtoken");
const { Admin } = require("../models/adminBlog.model");

function readBearerToken(req) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return String(auth.split(" ")[1] || "").trim();
  }
  return "";
}

const protect = async (req, res, next) => {
  let token = readBearerToken(req);

  // Some production proxies strip Authorization; accept explicit backup header.
  if (!token) {
    token = String(req.headers["x-admin-token"] || "").trim();
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-__v");

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Not authorized — admin not found or inactive" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized — invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.admin.role}' is not authorized for this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
