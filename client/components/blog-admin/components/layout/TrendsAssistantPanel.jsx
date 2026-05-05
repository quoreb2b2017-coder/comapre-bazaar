import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2, RefreshCw } from 'lucide-react'
import api from '../../utils/api'

const FULL_PROMPTS = [
  "What's trending for B2B software blogs?",
  'Suggest article angles for CRM buyers',
  'Hot HR / payroll software topics',
  'Marketing automation — trending angles',
]

const SIDEBAR_CHIPS = [
  { label: 'B2B trends', ask: FULL_PROMPTS[0] },
  { label: 'CRM ideas', ask: FULL_PROMPTS[1] },
  { label: 'HR / payroll', ask: FULL_PROMPTS[2] },
]

async function postTrendsChat(messages) {
  return api.post('/trends-chat', { messages }, { timeout: 120000 })
}

function SpanWithBold({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/)
    if (m) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-gray-50">
          {m[1]}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function FormattedAssistantBody({ text }) {
  return (
    <div className="text-[13.5px] leading-relaxed text-gray-700 dark:text-gray-200 space-y-1.5">
      {String(text).split('\n').map((line, i) => {
        const t = line.trimEnd()
        if (!t.trim()) return <div key={i} className="h-2" aria-hidden />
        const isBullet = /^-\s+/.test(t)
        const body = isBullet ? t.replace(/^-\s+/, '') : t
        return (
          <div key={i} className={isBullet ? 'flex gap-2.5 pl-0.5' : ''}>
            {isBullet && (
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
            )}
            <span className={`min-w-0 ${isBullet ? 'flex-1 pt-0.5' : 'block'}`}>
              <SpanWithBold text={body} />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * @param {{ toast?: { error?: (s: string) => void }, compact?: boolean }} props
 */
export function TrendsAssistantPanel({ toast, compact = true }) {
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content:
        'Hi — ask what’s trending (e.g. “fleet GPS”, “SMB CRM”), or tap a quick prompt below. I’ll suggest concrete blog topic angles for Compare Bazaar.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (textRaw) => {
    const text = String(textRaw ?? input).trim()
    if (!text || loading) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await postTrendsChat(next)
      const reply = res?.data?.reply
      if (!res?.success || !reply) {
        throw new Error(res?.message || 'No reply from assistant')
      }
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (e) {
      toast?.error?.(e.message || 'Trends chat failed')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const regenerateLast = async () => {
    if (loading) return
    let lastAssistant = messages.length - 1
    while (lastAssistant >= 0 && messages[lastAssistant].role !== 'assistant') lastAssistant -= 1
    if (lastAssistant < 1) return
    const withoutLastAssistant = messages.slice(0, lastAssistant)
    if (withoutLastAssistant[withoutLastAssistant.length - 1]?.role !== 'user') return

    setLoading(true)
    try {
      const res = await postTrendsChat(withoutLastAssistant)
      const reply = res?.data?.reply
      if (!res?.success || !reply) {
        throw new Error(res?.message || 'No reply from assistant')
      }
      setMessages([...withoutLastAssistant, { role: 'assistant', content: reply }])
    } catch (e) {
      toast?.error?.(e.message || 'Regenerate failed')
    } finally {
      setLoading(false)
    }
  }

  const showRegenerateOnBubble = (index, m) =>
    m.role === 'assistant' &&
    index === messages.length - 1 &&
    !loading &&
    index > 0 &&
    messages[index - 1]?.role === 'user'

  /* ——— Compact (sidebar-style) ——— */
  const compactScroll = 'max-h-[220px] overflow-y-auto space-y-2 pr-1 mb-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'

  const compactBody = (
    <>
      <div className={compactScroll}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-xs leading-relaxed rounded-lg px-2.5 py-2 ${
              m.role === 'user'
                ? 'bg-brand/25 text-white ml-3 border border-brand/35'
                : 'bg-white/[0.07] text-white/88 border border-white/10'
            }`}
          >
            {m.role === 'assistant' ? <FormattedAssistantBody text={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs px-2 py-2 text-white/50">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {SIDEBAR_CHIPS.map(({ label, ask }) => (
          <button
            key={label}
            type="button"
            disabled={loading}
            onClick={() => send(ask)}
            className="text-[10px] px-2 py-1 rounded-md bg-white/[0.08] text-white/80 hover:bg-white/15 border border-white/10"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Ask trending topics…"
          disabled={loading}
          className="flex-1 min-w-0 rounded-lg bg-white/[0.08] border border-white/15 text-white placeholder-white/35 text-xs px-2.5 py-2 outline-none focus:ring-1 focus:ring-brand/50"
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="flex-shrink-0 p-2 rounded-lg bg-brand hover:bg-brand-hover text-white disabled:opacity-40"
          title="Send"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </>
  )

  /* ——— Full page ——— clean chat / bubbles (no heavy “cards”) ——— */
  if (!compact) {
    const labelClass =
      'mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500'

    return (
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-gray-50">
            Trending topics
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Same Claude key as Generate blog · Editorial angles for Compare Bazaar
          </p>
        </header>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-950 overflow-hidden">
          <div className="max-h-[min(52vh,540px)] overflow-y-auto overscroll-contain px-4 py-6 sm:px-5 sm:py-7 space-y-7 bg-white dark:bg-gray-950">
            {messages.map((m, i) => (
              <div key={i}>
                {m.role === 'assistant' ? (
                  <div className="flex gap-3 items-end">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm"
                      aria-hidden
                    >
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 max-w-[min(100%,28rem)]">
                      <span className={labelClass}>Assistant</span>
                      <div className="rounded-[1.125rem] border border-gray-200 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-900">
                        <FormattedAssistantBody text={m.content} />
                        {showRegenerateOnBubble(i, m) && (
                          <button
                            type="button"
                            onClick={() => regenerateLast()}
                            disabled={loading}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-brand dark:text-gray-500 dark:hover:text-brand transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Regenerate reply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[min(100%,28rem)]">
                      <span className={`${labelClass} text-right`}>You</span>
                      <div className="rounded-[1.125rem] bg-brand px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-md shadow-brand/20">
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-end">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-brand/30 animate-pulse" aria-hidden />
                <div className="max-w-[min(100%,28rem)] space-y-2 rounded-[1.125rem] border border-gray-100 px-4 py-3 dark:border-gray-700">
                  <div className="h-2.5 w-[72%] rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-2.5 w-[58%] rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-5 sm:px-5 dark:border-gray-800 dark:bg-gray-950">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              Quick prompts
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {FULL_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => send(q)}
                  className="rounded-full border border-gray-200 bg-white px-3.5 py-2 text-left text-xs font-medium text-gray-800 shadow-none transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:border-gray-500"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white pl-4 pr-1.5 py-1.5 dark:border-gray-700 dark:bg-gray-950">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask what's trending, or describe a niche…"
                disabled={loading}
                rows={1}
                className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:bg-brand-hover disabled:opacity-35"
                title="Send"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={2} />}
              </button>
            </div>
            <p className="mt-2.5 text-center text-[11px] text-gray-400 dark:text-gray-500">
              Shift + Enter new line
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-2 mb-2 rounded-xl border border-white/10 bg-black/25 backdrop-blur-sm p-3 shadow-inner">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Trending topics</p>
      </div>
      {compactBody}
    </div>
  )
}
