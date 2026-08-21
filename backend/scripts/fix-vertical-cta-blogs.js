/**
 * One-off: inject vertical CTA blocks into Excel-queue blogs published recently
 * (and any published blog still missing data-blog-vertical-cta).
 *
 * Usage: node scripts/fix-vertical-cta-blogs.js
 * Optional: FIX_SINCE_HOURS=48 (default 36) — also force-refresh blogs in that window
 */
const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const connectDB = require('../src/config/db')
const Blog = require('../src/models/automationBlog.model')
const BlogExcelQueue = require('../src/models/blogExcelQueue.model')
const {
  resolveVerticalCta,
  injectVerticalCta,
  mergeVerticalTags,
  hasVerticalCta,
} = require('../src/services/blogAdmin.verticalCta.service')

async function main() {
  await connectDB()

  const hours = Math.max(1, Number(process.env.FIX_SINCE_HOURS || 36))
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  const queueDone = await BlogExcelQueue.find({
    status: 'done',
    blogId: { $ne: null },
    $or: [{ processedAt: { $gte: since } }, { updatedAt: { $gte: since } }],
  })
    .select('blogId category categoryLabel title')
    .lean()

  const queueBlogIds = queueDone.map((q) => q.blogId).filter(Boolean)
  const queueByBlogId = new Map(queueDone.map((q) => [String(q.blogId), q]))

  const blogs = await Blog.find({
    status: { $in: ['published', 'approved'] },
    $or: [
      { _id: { $in: queueBlogIds } },
      { publishedAt: { $gte: since } },
      { createdAt: { $gte: since } },
      { content: { $not: /data-blog-vertical-cta/i } },
      // Re-check recent CTA-injected posts so vertical remaps can apply
      {
        content: /data-blog-vertical-cta/i,
        updatedAt: { $gte: since },
      },
    ],
  })

  let updated = 0
  for (const blog of blogs) {
    const queue = queueByBlogId.get(String(blog._id))
    const vertical = resolveVerticalCta({
      category: queue?.category,
      categoryLabel: queue?.categoryLabel,
      topic: blog.topic,
      title: blog.title,
      tags: blog.tags,
      keywords: blog.keywords,
      slug: blog.slug,
    })

    const nextContent = injectVerticalCta(blog.content, {
      vertical,
      topic: blog.topic,
      title: blog.title,
      tags: blog.tags,
      keywords: blog.keywords,
      category: queue?.category,
      categoryLabel: queue?.categoryLabel || blog.topic,
    })
    const nextTags = mergeVerticalTags(blog.tags || [], vertical)
    const nextKeywords = Array.from(
      new Set([...(blog.keywords || []), ...nextTags])
    ).slice(0, 12)

    const contentChanged = nextContent !== blog.content
    const tagsChanged = JSON.stringify(nextTags) !== JSON.stringify(blog.tags || [])
    if (!contentChanged && !tagsChanged) continue

    // Avoid failing on pre-existing oversized SEO fields while we only patch CTA/tags
    const metaDescription =
      String(blog.metaDescription || '').length > 130
        ? String(blog.metaDescription).slice(0, 130)
        : blog.metaDescription
    const metaTitle =
      String(blog.metaTitle || '').length > 60
        ? String(blog.metaTitle).slice(0, 60)
        : blog.metaTitle

    await Blog.updateOne(
      { _id: blog._id },
      {
        $set: {
          content: nextContent,
          tags: nextTags,
          keywords: nextKeywords,
          ...(metaDescription != null ? { metaDescription } : {}),
          ...(metaTitle != null ? { metaTitle } : {}),
          ...(!blog.topic && (queue?.categoryLabel || vertical.categoryLabel)
            ? { topic: queue?.categoryLabel || vertical.categoryLabel }
            : {}),
        },
      }
    )
    updated += 1
    console.log(
      `[fixed] ${blog.slug || blog._id} → ${vertical.id} (cta=${hasVerticalCta(nextContent)})`
    )
  }

  console.log(`Done. Checked ${blogs.length} blogs, updated ${updated}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
