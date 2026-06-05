import { cleanDisplayText } from '@/lib/cleanDisplayText'

type Props = {
  questions: string[]
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
    <div>
      <label htmlFor={htmlFor} className="mb-0 block text-xs font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
    </div>
  )
}

export function WhitePaperHighlightFormFields({ questions, values, onChange, inputClass }: Props) {
  const items = (questions || []).map((q) => String(q || '').trim()).filter(Boolean)
  if (!items.length) return null

  return (
    <fieldset className="mt-2.5 border-0 p-0">
      <legend className="mb-1 block text-[13px] font-semibold text-navy">A few quick questions</legend>
      <div className="flex flex-col gap-1.5">
        {items.map((question, index) => (
          <Field
            key={`${index}-${question.slice(0, 24)}`}
            label={cleanDisplayText(question)}
            required
            htmlFor={`wp-custom-${index}`}
          >
            <input
              id={`wp-custom-${index}`}
              type="text"
              required
              value={values[index] || ''}
              onChange={(e) => onChange(index, e.target.value)}
              className={inputClass}
              maxLength={500}
            />
          </Field>
        ))}
      </div>
    </fieldset>
  )
}
