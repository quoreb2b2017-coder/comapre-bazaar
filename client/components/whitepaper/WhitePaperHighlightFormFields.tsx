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
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
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
    <fieldset className="mt-8 border-0 border-t border-gray-200 p-0 pt-8">
      <legend className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        A few quick questions
      </legend>
      <p className="mb-4 text-sm text-gray-600">Help us tailor this resource to your needs.</p>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 min-[480px]:grid-cols-2 min-[480px]:gap-x-6 min-[480px]:gap-y-5">
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
