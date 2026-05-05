const Anthropic = require('@anthropic-ai/sdk').default

let client = null

/** Model ID — override via ANTHROPIC_MODEL in .env. Older IDs (e.g. claude-3-5-sonnet-20241022) return 404 for many keys. */
const getModel = () =>
  process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'

/** Normalized text from @anthropic-ai/sdk and raw HTTP errors */
const formatAnthropicError = (error) => {
  if (!error) return 'Anthropic request failed'
  const body = error.body || error?.response?.data || error?.data
  const fromApi =
    body?.error?.message ||
    (typeof body?.error === 'string' ? body.error : null) ||
    error?.error?.error?.message ||
    error?.error?.message
  const nested = fromApi || error?.message || (typeof error === 'string' ? error : '')
  if (nested && String(nested).toLowerCase().includes('model')) {
    return `${nested} Set ANTHROPIC_MODEL in .env to a model your API key can use (see Console → API keys / model list).`
  }
  return String(nested || 'Anthropic request failed')
}

const getClient = (apiKey) => {
  const key = String(apiKey || process.env.ANTHROPIC_API_KEY || '').trim()
  if (!key) throw new Error('Anthropic API key not configured')
  if (!client || client._apiKey !== key) {
    client = new Anthropic({ apiKey: key })
    client._apiKey = key
  }
  return client
}

const normalizeKeywords = (keywords) => {
  if (Array.isArray(keywords)) {
    return keywords.map((k) => String(k).trim()).filter(Boolean)
  }
  if (typeof keywords === 'string' && keywords.trim()) {
    return keywords.split(/[,\n]/).map((k) => k.trim()).filter(Boolean)
  }
  return []
}

const getMessageText = (message) => {
  const block = message.content?.find((b) => b.type === 'text')
  if (block && block.text) return block.text
  const first = message.content?.[0]
  return first?.text || ''
}

/** Claude sometimes wraps HTML in markdown fences; strip so DB never stores a stray ```html / ``` line. */
const { getCompareBazaarEditorialContext } = require("./blogAdmin.siteReader.service")

const stripLeadingMarkdownFence = (raw) => {
  let s = String(raw || '').trim()
  s = s.replace(/^```(?:html|htm)?\s*\r?\n?/i, '')
  s = s.replace(/\r?\n```\s*$/i, '')
  return s.trim()
}

const TONE_PROMPTS = {
  professional: 'Write in a professional, authoritative, and informative tone. Use industry terminology appropriately. Maintain a formal but engaging voice.',
  casual: 'Write in a friendly, conversational, and approachable tone. Use simple language that anyone can understand. Be engaging and relatable.',
  'seo-optimized': 'Write with SEO best practices in mind. Naturally incorporate keywords, use proper heading hierarchy, include LSI keywords, and structure content for featured snippets. Keep paragraphs concise.',
}

/** Shorter articles = far less generated output → faster completion. Override with BLOG_GENERATE_FAST=1 or BLOG_GENERATE_MAX_TOKENS. */
function getGenerationLimits() {
  const fast = /^1|true|yes$/i.test(String(process.env.BLOG_GENERATE_FAST || '').trim())
  const parsed = parseInt(String(process.env.BLOG_GENERATE_MAX_TOKENS || '').trim(), 10)
  const defaultCap = fast ? 4608 : 6144
  const cap = Number.isFinite(parsed) ? parsed : defaultCap
  const maxTokens = Math.min(8192, Math.max(3072, cap))
  const wordBand = fast
    ? 'Target **480–720 words** of substantive prose (hero labels count lightly). No filler; tight paragraphs.'
    : 'Target **650–950 words** — solid SEO depth without very long pieces (hero labels count lightly). Avoid filler.'
  return { maxTokens, wordBand }
}

function countWordsFromHtml(html) {
  const text = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

const generateBlog = async ({ topic, keywords = [], tone = 'professional', customInstructions = '' }, apiKey) => {
  const anthropic = getClient(apiKey)
  const kw = normalizeKeywords(keywords)
  const { maxTokens, wordBand } = getGenerationLimits()

  const keywordStr = kw.length > 0 ? `Target keywords: ${kw.join(', ')}` : ''
  const tonePrompt = TONE_PROMPTS[tone] || TONE_PROMPTS.professional

  const siteContext = await getCompareBazaarEditorialContext()

  const systemPrompt = `You are an expert SEO blog writer for Compare Bazaar (compare-bazaar.com): editorial software buying guides and vendor-agnostic comparisons for business buyers. Reply with HTML for the article body only (no markdown code fences).

${tonePrompt}

Required structure:
1) **Hero (first element):** One <section class="blog-hero-banner not-prose" data-blog-banner="true"> with inline styles: unique multi-stop linear-gradient for this topic; padding 2rem 1.75rem; border-radius 20px; margin-bottom 2rem; position:relative; overflow:hidden; box-shadow 0 25px 50px -12px rgba(0,0,0,0.35); border 1px solid rgba(255,255,255,0.12); color #f8fafc. Inside: optional <p class="blog-hero-eyebrow">; exactly one <h1 class="blog-hero-title">; <p class="blog-hero-subtitle">; a decorative absolute radial glow <div> (pointer-events:none); <div class="blog-hero-icon-row" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:1.25rem;align-items:stretch"> with **four** <div class="blog-hero-pill"> items — each pill inline-flex, gap 10px, padding 10px 14px, rounded-full, rgba(255,255,255,0.12) fill, border rgba(255,255,255,0.18), optional backdrop-filter blur(8px), containing a 22px stroke <svg viewBox="0 0 24 24"> plus <span class="blog-hero-pill-label"> (2–5 words). Pick icons that match labels. No second H1 anywhere else.

2) After the hero: intro, multiple **real** <h2> sections with <h3> where useful, <ul>/<li> or <ol>/<li> lists, conclusion + CTA. Never fake headings with bold paragraphs.

Writing rules:
1) Generate humanized, SEO friendly content that sounds natural and engaging.
2) Do not use dashes in sentence flow. Replace them with commas, quotation marks, colons, or full stops as needed by context.
3) Keep the writing easy to read, well structured, and tailored to the target audience.
4) Write like an experienced human editor, vary sentence length, use natural transitions, and avoid robotic phrasing.
5) Avoid AI sounding patterns, avoid repetitive openers, avoid template style wording, and avoid generic filler lines.
6) Use clear, specific language with practical insights, examples, and buyer focused guidance wherever relevant.
7) Do not use the hyphen or em dash character in normal prose. If a compound term needs a separator, rewrite the phrase naturally.
8) Keep tone confident and conversational, with a helpful expert voice that sounds trustworthy and real.
9) Ensure originality, write every paragraph in fresh wording, and do not copy sentences from source material, websites, or known templates.
10) If live context is provided, use it only for facts and framing, then rewrite ideas in a distinct voice with unique sentence structure.
11) Avoid plagiarism by never reproducing trademark taglines, product page copy, or competitor phrasing verbatim, except short quoted text when absolutely necessary.
12) Produce publish ready content that is meaningfully unique in wording and flow from common web articles on the same topic.

${wordBand}`

  const siteBlock = siteContext.trim()
    ? `\n\n--- LIVE SITE CONTEXT (read Compare Bazaar’s real pages; match editorial voice and buyer-focused framing; do not copy sentences verbatim) ---\n${siteContext}\n--- END CONTEXT ---\n`
    : ''

  const userPrompt = `Write a focused, SEO-optimized blog post about: "${topic}"

${keywordStr}
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}
${siteBlock}
Please provide:
1. The full blog post content in HTML format (starting with the data-blog-banner section, then the rest of the article)
2. After the blog content, on a new line write "---META---"
3. Then provide:
   META_TITLE: [A compelling meta title under 60 chars]
   META_DESCRIPTION: [An engaging meta description under 155 chars]
   SUGGESTED_TAGS: [5 relevant tags, comma separated]
   EXCERPT: [A 2-3 sentence excerpt for the blog listing]`

  try {
    const model = getModel()
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const fullResponse = getMessageText(message) || ''
    const splitParts = fullResponse.split('---META---')
    const blogContentRaw = (splitParts[0] || '').trim()
    const metaSection = splitParts[1]

    if (!blogContentRaw) {
      throw new Error(
        'Claude returned empty content. Check ANTHROPIC_API_KEY, ANTHROPIC_MODEL (must match your Anthropic account), and try a shorter topic.'
      )
    }

    const blogContent = stripLeadingMarkdownFence(blogContentRaw)

    // Parse meta section
    let metaTitle = topic
    let metaDescription = `Read our comprehensive guide about ${topic}`
    let suggestedTags = kw.slice(0, 5)
    let excerpt = ''

    if (metaSection) {
      const metaLines = metaSection.trim().split('\n')
      metaLines.forEach((line) => {
        if (line.startsWith('META_TITLE:')) metaTitle = line.replace('META_TITLE:', '').trim()
        if (line.startsWith('META_DESCRIPTION:')) metaDescription = line.replace('META_DESCRIPTION:', '').trim()
        if (line.startsWith('SUGGESTED_TAGS:')) {
          suggestedTags = line.replace('SUGGESTED_TAGS:', '').trim().split(',').map((t) => t.trim())
        }
        if (line.startsWith('EXCERPT:')) excerpt = line.replace('EXCERPT:', '').trim()
      })
    }

    // Extract title from H1 tag
    const titleMatch = blogContent.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const extractedTitle = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : topic

    const trimmed = blogContent.trim()
    const wordCount = countWordsFromHtml(trimmed)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    return {
      success: true,
      data: {
        title: extractedTitle,
        content: trimmed,
        metaTitle: metaTitle.substring(0, 70),
        metaDescription: metaDescription.substring(0, 160),
        keywords: [...new Set([...kw, ...suggestedTags])].slice(0, 10),
        tags: suggestedTags,
        excerpt: excerpt || '',
        topic,
        tone,
        model,
        wordCount,
        readingTime,
        usage: message.usage,
      },
    }
  } catch (error) {
    const status = error.status ?? error.statusCode ?? error?.error?.status
    const detail = formatAnthropicError(error)
    console.error('Claude API error:', { status, detail, raw: error?.body || error?.message })
    if (status === 401) throw new Error('Invalid Claude API key (unauthorized).')
    if (status === 429) throw new Error('Claude API rate limit exceeded. Please wait and try again.')
    if (status === 404 || String(detail).toLowerCase().includes('model')) {
      throw new Error(`Model issue (${getModel()}): ${detail}`)
    }
    throw new Error(detail)
  }
}

/** One minimal API call to verify the key + model work (used by Settings “Test”). */
const validateAnthropicKey = async (apiKey) => {
  const anthropic = getClient(apiKey)
  const model = getModel()
  await anthropic.messages.create({
    model,
    max_tokens: 8,
    messages: [{ role: 'user', content: 'Reply with the single word OK.' }],
  })
}

module.exports = { generateBlog, validateAnthropicKey, getModel }
