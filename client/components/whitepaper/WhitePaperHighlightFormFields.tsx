'use client'

import { cleanDisplayText } from '@/lib/cleanDisplayText'
import { type HighlightQuestion, isDropdownQuestion } from '@/lib/highlightQuestions'
import { WhitePaperCustomSelect } from '@/components/whitepaper/WhitePaperCustomSelect'

type Props = {
  questions: HighlightQuestion[]
  values: string[]
  onChange: (index: number, value: string) => void
  inputClass: string
}

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
    </div>
  )
}

export function WhitePaperHighlightFormFields({ questions, values, onChange, inputClass }: Props) {
  const items = (questions || []).filter((q) => String(q.question || '').trim())
  if (!items.length) return null

  const textInputClass = `${inputClass} h-9 rounded-lg px-3 shadow-[0_1px_2px_rgba(15,31,61,0.04)] transition-all duration-200 hover:border-gray-300 focus:border-cb-orange focus:ring-2 focus:ring-cb-orange/15`

  return (
    <fieldset className="mt-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
      <legend className="mb-2 block px-0.5 text-[13px] font-semibold text-navy">A few quick questions</legend>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const label = cleanDisplayText(item.question)
          const id = `wp-custom-${index}`
          const dropdown = isDropdownQuestion(item)

          return (
            <Field key={`${index}-${item.question.slice(0, 24)}`} label={label} required htmlFor={id}>
              {dropdown ? (
                <WhitePaperCustomSelect
                  id={id}
                  required
                  value={values[index] || ''}
                  options={item.options}
                  onChange={(value) => onChange(index, value)}
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  required
                  value={values[index] || ''}
                  onChange={(e) => onChange(index, e.target.value)}
                  className={textInputClass}
                  maxLength={500}
                />
              )}
            </Field>
          )
        })}
      </div>
    </fieldset>
  )
}
