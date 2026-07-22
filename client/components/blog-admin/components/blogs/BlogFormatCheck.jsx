const STATUS_STYLE = {
  ok: 'text-emerald-600 dark:text-emerald-400',
  warn: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
}

const STATUS_DOT = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-400',
  error: 'bg-red-500',
}

export function BlogFormatCheck({ formatCheck }) {
  if (!formatCheck?.checks?.length) return null

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Format check</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        SEO standards: title &amp; H1 50–60 chars · description 120–130 chars · excerpt &amp; subtitle 50–60 words
      </p>
      <ul className="space-y-2.5">
        {formatCheck.checks.map((c) => (
          <li key={c.label} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[c.status] || STATUS_DOT.warn}`} />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-800 dark:text-gray-200">{c.label}</span>
              <span className={`block text-xs mt-0.5 ${STATUS_STYLE[c.status] || STATUS_STYLE.warn}`}>
                {c.detail}
                {c.status === 'warn' ? ' · below target' : ''}
                {c.status === 'error' ? ' · too long' : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Client-side counters while editing */
export function countWordsClient(text) {
  const t = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

export function metaTitleCounter(value) {
  const n = String(value || '').length
  let cls = 'text-gray-400'
  if (n > 60) cls = 'text-red-500'
  else if (n >= 50 && n <= 60) cls = 'text-emerald-600'
  else if (n > 0) cls = 'text-amber-600'
  return { text: `${n}/60 chars (target 50–60)`, cls }
}

export function metaDescCounter(value) {
  const n = String(value || '').length
  let cls = 'text-gray-400'
  if (n > 130) cls = 'text-red-500'
  else if (n >= 120 && n <= 130) cls = 'text-emerald-600'
  else if (n > 0) cls = 'text-amber-600'
  return { text: `${n}/130 chars (target 120–130)`, cls }
}

export function excerptCounter(value) {
  const n = countWordsClient(value)
  let cls = 'text-gray-400'
  if (n > 60) cls = 'text-red-500'
  else if (n >= 50 && n <= 60) cls = 'text-emerald-600'
  else if (n > 0) cls = 'text-amber-600'
  return { text: `${n}/60 words (target 50–60)`, cls }
}
