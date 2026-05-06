const express = require("express");
const BlogSubscriber = require("../models/blogSubscriber.model");
const Blog = require("../models/automationBlog.model");
const { protect } = require("../middlewares/blogAdminAuth.middleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20));
    const search = String(req.query.search || "").trim();
    const isActiveRaw = String(req.query.isActive || "").trim().toLowerCase();
    const query = {};
    if (search) query.email = { $regex: search, $options: "i" };
    if (isActiveRaw === "true") query.isActive = true;
    if (isActiveRaw === "false") query.isActive = false;

    const skip = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      BlogSubscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogSubscriber.countDocuments(query),
    ]);

    const unresolvedSlugs = [...new Set(
      rows
        .filter((r) => !r.sourceBlogId && !r.sourceBlogTitle && (r.sourceBlogSlug || r.subscribedFrom))
        .map((r) => String(r.sourceBlogSlug || r.subscribedFrom || "").trim())
        .filter(Boolean)
    )];
    let blogBySlug = new Map();
    if (unresolvedSlugs.length) {
      const blogs = await Blog.find({ slug: { $in: unresolvedSlugs } }).select("_id slug title").lean();
      blogBySlug = new Map(blogs.map((b) => [String(b.slug || ""), b]));
    }
    const enrichedRows = rows.map((r) => {
      if (r.sourceBlogId || r.sourceBlogTitle) return r;
      const slug = String(r.sourceBlogSlug || r.subscribedFrom || "").trim();
      const b = blogBySlug.get(slug);
      if (!b) return r;
      return {
        ...r,
        sourceBlogId: String(b._id || ""),
        sourceBlogSlug: b.slug || slug,
        sourceBlogTitle: b.title || "",
      };
    });

    res.json({
      success: true,
      data: enrichedRows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/toggle", protect, async (req, res) => {
  try {
    const row = await BlogSubscriber.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Subscriber not found" });
    row.isActive = !row.isActive;
    await row.save();
    res.json({ success: true, data: row, message: row.isActive ? "Subscriber activated" : "Subscriber paused" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const row = await BlogSubscriber.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Subscriber not found" });
    res.json({ success: true, message: "Subscriber deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
