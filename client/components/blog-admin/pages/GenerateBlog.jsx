import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Zap, Save, Eye, Edit, X, Loader2, Briefcase, MessageCircle, Target, RefreshCw } from 'lucide-react'
import api, { API_TIMEOUT_LONG_MS } from '../utils/api'

const TONES = [
  { value: 'professional', label: 'Professional', icon: Briefcase, hint: 'Formal' },
  { value: 'casual', label: 'Casual', icon: MessageCircle, hint: 'Conversational' },
  { value: 'seo-optimized', label: 'SEO', icon: Target, hint: 'Keyword-focused' },
]

export const GenerateBlog = () => {
  const { toast } = useOutletContext()
  const navigate = useNavigate()

  const [form, setForm] = useState({ topic: '', keywords: '', tone: 'professional', customInstructions: '' })
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(null)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const addKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const kw = keywordInput.trim().replace(/,$/, '')
      if (kw && !keywords.includes(kw) && keywords.length < 10) {
        setKeywords([...keywords, kw])
        setKeywordInput('')
      }
    }
  }

  const removeKeyword = (kw) => setKeywords(keywords.filter((k) => k !== kw))

  const runGenerate = async () => {
    if (!form.topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    setPreviewMode(false)
    setLoading(true)
    setGenerated(null)
    try {
      const res = await api.post('/generate-blog', { ...form, keywords }, { timeout: API_TIMEOUT_LONG_MS })
      setGenerated(res.data)
      toast.success(res.message)
    } catch (err) {
      toast.error(err.message || 'Generation failed — try Regenerate.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = (e) => {
    e.preventDefault()
    runGenerate()
  }

  const handleSave = async () => {
    if (!generated) return
    setSaving(true)
    try {
      const res = await api.post('/generate-blog/save', {
        title: generated.title,
        content: generated.content,
        metaTitle: generated.metaTitle,
        metaDescription: generated.metaDescription,
        keywords: generated.keywords,
        tags: generated.tags,
        excerpt: generated.excerpt,
        topic: generated.topic,
        tone: generated.tone,
      })
      toast.success(res.message)
      navigate(`/blogs/${res.data._id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Generate Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Each run pulls plain-text excerpts from{' '}
          <span className="font-medium text-gray-600 dark:text-gray-300">compare-bazaar.com</span> (homepage + /blog) so the draft
          matches site voice. Use <strong className="font-medium">Regenerate</strong> if no article appeared or you want another pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Blog configuration</h2>
              <p className="text-xs text-gray-400 mt-0.5">Topic, tone, and optional hints for Claude</p>
            </div>

            {/* Topic */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic <span className="text-red-500">*</span></label>
              <input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Best CRM software for small businesses in 2026"
                className="input"
                required
              />
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target keywords</label>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] px-3 py-2 rounded-xl border border-gray-200/90 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/25 transition-all">
                {keywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600 text-brand dark:text-brand-light text-xs font-medium px-2 py-0.5 rounded-md shadow-sm">
                    {kw}
                    <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 transition-colors rounded p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={addKeyword}
                  placeholder={keywords.length === 0 ? 'Keyword + Enter' : 'Add more'}
                  className="flex-1 min-w-[100px] outline-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                />
              </div>
              <p className="text-xs text-gray-400">{keywords.length}/10 keywords</p>
            </div>

            {/* Tone — compact segmented control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Writing tone</label>
              <div
                className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-gray-100/90 dark:bg-gray-800/80"
                role="radiogroup"
                aria-label="Writing tone"
              >
                {TONES.map(({ value, label, icon: Icon, hint }) => {
                  const active = form.tone === value
                  return (
                    <label
                      key={value}
                      className={`relative flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-lg px-2 py-2.5 text-center transition-all ${
                        active
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={value}
                        checked={active}
                        onChange={() => setForm({ ...form, tone: value })}
                        className="sr-only"
                      />
                      <Icon className={`w-4 h-4 ${active ? 'text-brand' : ''}`} aria-hidden />
                      <span className="text-xs font-semibold leading-tight">{label}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">{hint}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Custom instructions */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional instructions <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.customInstructions}
                onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
                placeholder="e.g. Include a comparison table, focus on SMBs…"
                rows={3}
                className="input resize-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="submit"
                disabled={loading || !form.topic.trim()}
                className="btn-primary flex-1 justify-center py-3 rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating with Claude…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Generate blog
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => runGenerate()}
                disabled={loading || !form.topic.trim()}
                title="Run again with the same topic, keywords, and tone"
                className="btn-secondary flex-1 justify-center gap-2 py-3 rounded-xl sm:max-w-[200px]"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Same API call as Generate — use if the response was empty, timed out, or you want a fresh draft.
            </p>
          </form>
        </div>

        {/* Generated content */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/90 animate-pulse">
                <Zap className="h-7 w-7 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">
                Generating your blog…
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Claude is crafting content — usually 15–30 seconds.
              </p>
              <div className="mt-5 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : generated ? (
            previewMode ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Live preview</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {generated.wordCount || 0} words · {generated.readingTime || 1} min read
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => runGenerate()} disabled={loading || !form.topic.trim()} className="btn-secondary text-xs">
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Regenerate
                    </button>
                    <button type="button" onClick={() => setPreviewMode(false)} className="btn-secondary text-xs">
                      <Edit className="w-3.5 h-3.5" /> Raw HTML
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="btn-primary text-xs">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Draft
                    </button>
                  </div>
                </div>
                <p className="pt-4 text-lg font-bold text-gray-900 dark:text-gray-100">{generated.title}</p>
                <div
                  className="blog-preview blog-cms-html prose prose-lg max-w-none text-gray-700 dark:prose-invert pt-4 pb-6 max-h-[min(560px,70vh)] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generated.content }}
                />
              </>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/40">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Generated content</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {generated.wordCount || 0} words · {generated.readingTime || 1} min read
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => runGenerate()} disabled={loading || !form.topic.trim()} className="btn-secondary text-xs">
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Regenerate
                    </button>
                    <button type="button" onClick={() => setPreviewMode(true)} className="btn-secondary text-xs">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="btn-primary text-xs">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Draft
                    </button>
                  </div>
                </div>

                <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{generated.title}</h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-semibold text-gray-500 w-28 flex-shrink-0 pt-0.5">Meta Title:</span>
                      <span className="text-gray-600 dark:text-gray-400">{generated.metaTitle}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-semibold text-gray-500 w-28 flex-shrink-0 pt-0.5">Meta Desc:</span>
                      <span className="text-gray-600 dark:text-gray-400">{generated.metaDescription}</span>
                    </div>
                    {generated.keywords?.length > 0 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="font-semibold text-gray-500 w-28 flex-shrink-0 pt-0.5">Keywords:</span>
                        <div className="flex flex-wrap gap-1">
                          {generated.keywords.slice(0, 8).map((kw) => (
                            <span key={kw} className="bg-brand-light text-brand px-2 py-0.5 rounded-full">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 max-h-[500px] overflow-y-auto">
                  <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                    {generated.content}
                  </pre>
                </div>
              </div>
            )
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/90">
                <Zap className="h-7 w-7 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-gray-100">No content yet</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Fill in the configuration and click &quot;Generate Blog&quot; to create AI-powered content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
