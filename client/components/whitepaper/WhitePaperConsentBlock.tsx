'use client'

import Link from 'next/link'

const linkClass = 'font-medium text-cb-orange underline-offset-2 hover:text-cb-orange-hover hover:underline'

export type DownloadConsentCopy = {
  emailNote?: string
  termsText?: string
  partnersText?: string
  optOutText?: string
  footerText?: string
  showTerms?: boolean
  showPartners?: boolean
  showOptOut?: boolean
  extra?: { text: string; required?: boolean }[]
}

const FALLBACK_TERMS =
  "I agree to Compare Bazaar's {{terms}}, {{privacy}}, and the transfer of my information to the United States for processing to provide me with relevant information as described in our {{privacy}}."
const FALLBACK_PARTNERS =
  'I agree to my information being processed by Compare Bazaar and its partners to contact me via phone, email or other means regarding information relevant to my professional interests. I may {{unsubscribe}} at any time.'
const FALLBACK_OPT_OUT =
  '**Optional:** check this box only if you want to **opt out of further emails** from Compare Bazaar. Leave it unchecked to keep receiving relevant updates. Read our {{privacy-statement}}.'
const FALLBACK_FOOTER = 'I have read and understood privacy statement of {{publisher}}.'
const FALLBACK_EMAIL_NOTE =
  'Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.'

export function resolveDownloadConsent(copy?: DownloadConsentCopy | null): Required<DownloadConsentCopy> {
  return {
    emailNote: copy?.emailNote?.trim() || FALLBACK_EMAIL_NOTE,
    termsText: copy?.termsText?.trim() || FALLBACK_TERMS,
    partnersText: copy?.partnersText?.trim() || FALLBACK_PARTNERS,
    optOutText: copy?.optOutText?.trim() || FALLBACK_OPT_OUT,
    footerText: copy?.footerText?.trim() || FALLBACK_FOOTER,
    showTerms: copy?.showTerms !== false,
    showPartners: copy?.showPartners !== false,
    showOptOut: copy?.showOptOut !== false,
    extra: Array.isArray(copy?.extra)
      ? copy.extra.filter((item) => String(item?.text || '').trim()).slice(0, 8)
      : [],
  }
}

const TOKEN_LINKS: Record<string, { href: string; label: string }> = {
  terms: { href: '/terms-of-use', label: 'Terms of Use' },
  privacy: { href: '/privacy-policy', label: 'Privacy Policy' },
  'privacy-statement': { href: '/privacy-policy', label: 'privacy statement' },
  unsubscribe: { href: '/unsubscribe', label: 'unsubscribe' },
  publisher: { href: '/privacy-policy', label: 'Compare Bazaar' },
}

function ConsentRichText({ text }: { text: string }) {
  const re = /\{\{(terms|privacy|privacy-statement|unsubscribe|publisher)\}\}|\*\*([^*]+)\*\*/g
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[1]) {
      const link = TOKEN_LINKS[match[1]]
      nodes.push(
        <Link key={key} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {link.label}
        </Link>
      )
    } else if (match[2]) {
      nodes.push(
        <span key={key} className="font-semibold text-gray-800">
          {match[2]}
        </span>
      )
    }
    key += 1
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <>{nodes}</>
}

type Props = {
  termsAccepted: boolean
  partnersAccepted?: boolean
  optOutCommunication: boolean
  onTermsChange: (checked: boolean) => void
  onPartnersChange?: (checked: boolean) => void
  onOptOutChange: (checked: boolean) => void
  /** Unique id prefix so email + profile steps do not clash. */
  idPrefix?: string
  /** Show the required Terms / Privacy agreement checkbox. */
  showTerms?: boolean
  copy?: DownloadConsentCopy
  extraAccepted?: boolean[]
  onExtraChange?: (index: number, checked: boolean) => void
  className?: string
}

/**
 * Compare Bazaar white paper consent block (Terms + opt-out + privacy footer).
 * Brand: Compare Bazaar · accent: cb-orange.
 */
export function WhitePaperConsentBlock({
  termsAccepted,
  partnersAccepted = false,
  optOutCommunication,
  onTermsChange,
  onPartnersChange,
  onOptOutChange,
  idPrefix = 'wp',
  showTerms = true,
  copy,
  extraAccepted = [],
  onExtraChange,
  className = '',
}: Props) {
  const resolved = resolveDownloadConsent(copy)
  const showPartners = resolved.showPartners && Boolean(onPartnersChange)
  const showOptOut = resolved.showOptOut
  const termsOn = showTerms && resolved.showTerms

  return (
    <div className={`space-y-3 ${className}`}>
      {termsOn ? (
        <label className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
          <input
            id={`${idPrefix}-terms`}
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-cb-orange"
          />
          <span>
            <ConsentRichText text={resolved.termsText} />
          </span>
        </label>
      ) : null}

      {showPartners ? (
        <label className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
          <input
            id={`${idPrefix}-partners`}
            type="checkbox"
            required
            checked={partnersAccepted}
            onChange={(e) => onPartnersChange?.(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-black"
          />
          <span>
            <ConsentRichText text={resolved.partnersText} />
          </span>
        </label>
      ) : null}

      {showOptOut ? (
        <label className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
          <input
            id={`${idPrefix}-opt-out`}
            type="checkbox"
            checked={optOutCommunication}
            onChange={(e) => onOptOutChange(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-cb-orange"
          />
          <span>
            <ConsentRichText text={resolved.optOutText} />
          </span>
        </label>
      ) : null}

      {(resolved.extra || []).map((item, index) => (
        <label key={`${index}-${item.text.slice(0, 24)}`} className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
          <input
            id={`${idPrefix}-extra-${index}`}
            type="checkbox"
            required={item.required !== false}
            checked={Boolean(extraAccepted[index])}
            onChange={(e) => onExtraChange?.(index, e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-cb-orange"
          />
          <span>
            <ConsentRichText text={item.text} />
          </span>
        </label>
      ))}
    </div>
  )
}

export function WhitePaperConsentFooter({ text }: { text?: string }) {
  return (
    <p className="mt-3 text-center text-[12px] leading-snug text-gray-600">
      <ConsentRichText text={text?.trim() || FALLBACK_FOOTER} />
    </p>
  )
}
