import { Plus, X } from 'lucide-react'

const MAX_QUESTIONS = 20

export function WhitePaperHighlightQuestions({ questions, onChange }) {
  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return
    onChange([...questions, ''])
  }

  const updateAt = (index, value) => {
    const next = [...questions]
    next[index] = value
    onChange(next)
  }

  const removeAt = (index) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="label mb-0">Download form questions</label>
        <button
          type="button"
          onClick={addQuestion}
          disabled={questions.length >= MAX_QUESTIONS}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          title="Add point"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Optional. Each question appears as a required input on the public download form — visitors must answer before
        getting the PDF (max {MAX_QUESTIONS}).
      </p>

      {questions.length === 0 ? (
        <button
          type="button"
          onClick={addQuestion}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-4 text-sm text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
        >
          <Plus className="h-4 w-4" />
          Click to add first point
        </button>
      ) : (
        <ul className="space-y-2">
          {questions.map((q, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-800">
                {index + 1}
              </span>
              <input
                type="text"
                className="input min-h-0 flex-1 py-2"
                value={q}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder="e.g. What types of fleet do you need?"
                maxLength={500}
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="mt-1 shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function highlightQuestionsFromPaper(paper) {
  const raw = paper?.highlightQuestions
  if (!Array.isArray(raw)) return []
  return raw.map((q) => String(q || '').trim()).filter(Boolean)
}

export function highlightQuestionsToPayload(questions) {
  return questions.map((q) => String(q || '').trim()).filter(Boolean)
}
