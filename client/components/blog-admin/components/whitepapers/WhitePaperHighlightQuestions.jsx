import { Plus, X } from 'lucide-react'
import {
  emptyHighlightQuestion,
  HIGHLIGHT_OPTIONS_MAX,
  HIGHLIGHT_QUESTIONS_MAX,
  parseHighlightQuestions,
} from '@/lib/highlightQuestions'

export function WhitePaperHighlightQuestions({ questions, onChange }) {
  const addQuestion = () => {
    if (questions.length >= HIGHLIGHT_QUESTIONS_MAX) return
    onChange([...questions, emptyHighlightQuestion()])
  }

  const updateQuestion = (index, value) => {
    const next = [...questions]
    next[index] = { ...next[index], question: value }
    onChange(next)
  }

  const addOption = (qIndex) => {
    const next = [...questions]
    const item = next[qIndex]
    if (!item || item.options.length >= HIGHLIGHT_OPTIONS_MAX) return
    next[qIndex] = { ...item, options: [...item.options, ''] }
    onChange(next)
  }

  const updateOption = (qIndex, optIndex, value) => {
    const next = [...questions]
    const item = next[qIndex]
    if (!item) return
    const options = [...item.options]
    options[optIndex] = value
    next[qIndex] = { ...item, options }
    onChange(next)
  }

  const removeOption = (qIndex, optIndex) => {
    const next = [...questions]
    const item = next[qIndex]
    if (!item) return
    next[qIndex] = { ...item, options: item.options.filter((_, i) => i !== optIndex) }
    onChange(next)
  }

  const removeQuestion = (index) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="label mb-0">Download form questions</label>
        <button
          type="button"
          onClick={addQuestion}
          disabled={questions.length >= HIGHLIGHT_QUESTIONS_MAX}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Optional. Each question appears on the public download form. Add 2+ options to show a dropdown; leave
        options empty for a text field (max {HIGHLIGHT_QUESTIONS_MAX} questions).
      </p>

      {questions.length === 0 ? (
        <button
          type="button"
          onClick={addQuestion}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-4 text-sm text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
        >
          <Plus className="h-4 w-4" />
          Click to add first question
        </button>
      ) : (
        <ul className="space-y-3">
          {questions.map((item, index) => (
            <li
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-700 dark:bg-gray-900/40"
            >
              <div className="flex items-start gap-2">
                <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-gray-500 dark:bg-gray-800">
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="input min-h-0 flex-1 py-2"
                  value={item.question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="e.g. What is your fleet size?"
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-1 shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  aria-label="Remove question"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2.5 ml-7 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Dropdown options (optional)
                  </p>
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    disabled={item.options.length >= HIGHLIGHT_OPTIONS_MAX}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                    Add option
                  </button>
                </div>

                {item.options.length === 0 ? (
                  <p className="text-[11px] text-gray-400">No options — visitors type a free-text answer.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {item.options.map((opt, optIndex) => (
                      <li key={optIndex} className="flex items-center gap-2">
                        <span className="w-4 shrink-0 text-center text-[10px] text-gray-400">{optIndex + 1}.</span>
                        <input
                          type="text"
                          className="input min-h-0 flex-1 py-1.5 text-sm"
                          value={opt}
                          onChange={(e) => updateOption(index, optIndex, e.target.value)}
                          placeholder="e.g. 1–10 vehicles"
                          maxLength={200}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, optIndex)}
                          className="shrink-0 rounded p-1.5 text-gray-400 hover:text-red-600"
                          aria-label="Remove option"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {item.options.length === 1 ? (
                  <p className="text-[11px] text-amber-700">Add one more option to enable dropdown on the public form.</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function highlightQuestionsFromPaper(paper) {
  return parseHighlightQuestions(paper?.highlightQuestions)
}

export function highlightQuestionsToPayload(questions) {
  return questions
    .map((item) => ({
      question: String(item?.question || '').trim(),
      options: Array.isArray(item?.options)
        ? item.options.map((o) => String(o || '').trim()).filter(Boolean)
        : [],
    }))
    .filter((item) => item.question)
}
