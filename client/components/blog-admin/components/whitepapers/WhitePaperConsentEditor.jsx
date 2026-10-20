import { Plus, X } from 'lucide-react'

export const DEFAULT_DOWNLOAD_CONSENT = {
  emailNote: 'Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.',
  termsText:
    "I agree to Compare Bazaar's {{terms}}, {{privacy}}, and the transfer of my information to the United States for processing to provide me with relevant information as described in our {{privacy}}.",
  partnersText:
    'I agree to my information being processed by Compare Bazaar and its partners to contact me via phone, email or other means regarding information relevant to my professional interests. I may {{unsubscribe}} at any time.',
  optOutText:
    '**Optional:** check this box only if you want to **opt out of further emails** from Compare Bazaar. Leave it unchecked to keep receiving relevant updates. Read our {{privacy-statement}}.',
  footerText: 'I have read and understood privacy statement of {{publisher}}.',
  showTerms: true,
  showPartners: true,
  showOptOut: true,
}

export function consentFromPaper(paper) {
  const raw = paper?.downloadConsent || {}
  return {
    emailNote: raw.emailNote || DEFAULT_DOWNLOAD_CONSENT.emailNote,
    termsText: raw.termsText || DEFAULT_DOWNLOAD_CONSENT.termsText,
    partnersText: raw.partnersText || DEFAULT_DOWNLOAD_CONSENT.partnersText,
    optOutText: raw.optOutText || DEFAULT_DOWNLOAD_CONSENT.optOutText,
    footerText: raw.footerText || DEFAULT_DOWNLOAD_CONSENT.footerText,
  showTerms: raw.showTerms !== false,
  showPartners: raw.showPartners !== false,
  showOptOut: raw.showOptOut !== false,
  extra: Array.isArray(raw.extra)
    ? raw.extra
        .map((item) => ({
          text: String(item?.text || ''),
          required: item?.required !== false,
        }))
        .filter((item) => item.text.trim())
    : [],
}
}

const FIELDS = [
  { key: 'emailNote', showKey: null, label: 'Email note', rows: 2 },
  { key: 'termsText', showKey: 'showTerms', label: 'Terms checkbox', rows: 3 },
  { key: 'partnersText', showKey: 'showPartners', label: 'Partners checkbox', rows: 3 },
  { key: 'optOutText', showKey: 'showOptOut', label: 'Opt-out checkbox', rows: 3 },
  { key: 'footerText', showKey: null, label: 'Line under Download Now', rows: 2 },
]

export function WhitePaperConsentEditor({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-2">
      <label className="label mb-0">Download form consent text</label>
      <p className="text-xs text-gray-500">
        Edit the email note and the three checkboxes on the public form. Links:{' '}
        <code className="text-[11px]">{'{{terms}}'}</code> Terms of Use,{' '}
        <code className="text-[11px]">{'{{privacy}}'}</code> Privacy Policy,{' '}
        <code className="text-[11px]">{'{{privacy-statement}}'}</code> privacy statement,{' '}
        <code className="text-[11px]">{'{{unsubscribe}}'}</code>,{' '}
        <code className="text-[11px]">{'{{publisher}}'}</code> Compare Bazaar. Use **bold** for emphasis.
      </p>
      {FIELDS.map((field) => (
        <div key={field.key} className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{field.label}</span>
            {field.showKey ? (
              <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={value[field.showKey] !== false}
                  onChange={(e) => set({ [field.showKey]: e.target.checked })}
                />
                Show
              </label>
            ) : null}
          </div>
          <textarea
            className="input min-h-0 resize-y py-2 text-sm"
            rows={field.rows}
            value={value[field.key] || ''}
            onChange={(e) => set({ [field.key]: e.target.value })}
          />
        </div>
      ))}

      <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Extra checkboxes</span>
          <button
            type="button"
            onClick={() =>
              set({
                extra: [...(value.extra || []), { text: '', required: true }].slice(0, 8),
              })
            }
            disabled={(value.extra || []).length >= 8}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand hover:text-brand disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Add checkbox
          </button>
        </div>
        {(value.extra || []).length === 0 ? (
          <p className="text-xs text-gray-400">No extra checkboxes yet. Add one and it shows on the download form.</p>
        ) : null}
        {(value.extra || []).map((item, index) => (
          <div key={index} className="space-y-1.5 rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-900/40">
            <div className="flex items-center justify-between gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={item.required !== false}
                  onChange={(e) => {
                    const extra = [...value.extra]
                    extra[index] = { ...item, required: e.target.checked }
                    set({ extra })
                  }}
                />
                Required
              </label>
              <button
                type="button"
                onClick={() => set({ extra: value.extra.filter((_, i) => i !== index) })}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                title="Remove checkbox"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              className="input min-h-0 resize-y py-2 text-sm"
              rows={2}
              value={item.text}
              placeholder="Checkbox text. Links: {{terms}} {{privacy}} {{unsubscribe}}"
              onChange={(e) => {
                const extra = [...value.extra]
                extra[index] = { ...item, text: e.target.value }
                set({ extra })
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
