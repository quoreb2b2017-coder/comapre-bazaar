import { Plus, X } from 'lucide-react'

export const DOWNLOAD_FIELD_OPTIONS = [
  { key: 'companyPostal', label: 'Zip/Postal Code', inputType: 'text' },
  { key: 'workPhone', label: 'Phone', inputType: 'tel' },
  { key: 'firstName', label: 'First name', inputType: 'text' },
  { key: 'lastName', label: 'Last name', inputType: 'text' },
  { key: 'jobTitle', label: 'Job title', inputType: 'text' },
  { key: 'companyStreet', label: 'Street address', inputType: 'text' },
  { key: 'companySuite', label: 'Suite / office', inputType: 'text' },
  { key: 'companyCity', label: 'City', inputType: 'text' },
  { key: 'companyState', label: 'State / province', inputType: 'text' },
  { key: 'companyCountry', label: 'Country', inputType: 'text' },
]

export const DEFAULT_DOWNLOAD_FIELDS = [
  { label: 'Zip/Postal Code', key: 'companyPostal', inputType: 'text', required: true },
  { label: 'Phone', key: 'workPhone', inputType: 'tel', required: true },
]

export function downloadFieldsFromPaper(paper) {
  const raw = paper?.downloadFormFields
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_DOWNLOAD_FIELDS.map((f) => ({ ...f }))
  return raw.map((f) => ({
    label: f.label || '',
    key: f.key || '',
    inputType: f.inputType || 'text',
    required: f.required !== false,
  }))
}

export function WhitePaperFormSections({ fields, onChange }) {
  const used = new Set(fields.map((f) => f.key))

  const addField = () => {
    const next = DOWNLOAD_FIELD_OPTIONS.find((o) => !used.has(o.key))
    if (!next || fields.length >= 12) return
    onChange([
      ...fields,
      { label: next.label, key: next.key, inputType: next.inputType, required: true },
    ])
  }

  const update = (index, patch) => {
    const next = [...fields]
    const current = { ...next[index], ...patch }
    if (patch.key) {
      const opt = DOWNLOAD_FIELD_OPTIONS.find((o) => o.key === patch.key)
      if (opt && !patch.label) {
        current.label = opt.label
        current.inputType = opt.inputType
      }
    }
    next[index] = current
    onChange(next)
  }

  const remove = (index) => onChange(fields.filter((_, i) => i !== index))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="label mb-0">Download form sections</label>
        <button
          type="button"
          onClick={addField}
          disabled={fields.length >= 12 || used.size >= DOWNLOAD_FIELD_OPTIONS.length}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand hover:text-brand disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Add section
        </button>
      </div>
      <p className="text-xs text-gray-500">
        These fields show on the public download form. Default is Zip and Phone. Add a field, then save the white paper.
      </p>

      <ul className="space-y-2">
        {fields.map((field, index) => (
          <li
            key={`${field.key}-${index}`}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-900/40"
          >
            <select
              className="input min-w-0 flex-1"
              value={field.key}
              onChange={(e) => {
                const opt = DOWNLOAD_FIELD_OPTIONS.find((o) => o.key === e.target.value)
                update(index, {
                  key: e.target.value,
                  inputType: opt?.inputType || 'text',
                  label: opt?.label || '',
                })
              }}
            >
              {DOWNLOAD_FIELD_OPTIONS.map((o) => (
                <option key={o.key} value={o.key} disabled={used.has(o.key) && o.key !== field.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={field.required !== false}
                onChange={(e) => update(index, { required: e.target.checked })}
              />
              Required
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600"
              title="Remove section"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
