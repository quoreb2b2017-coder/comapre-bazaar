'use client'

import Link from 'next/link'

const linkClass = 'font-medium text-cb-orange underline-offset-2 hover:text-cb-orange-hover hover:underline'

type Props = {
  termsAccepted: boolean
  optOutCommunication: boolean
  onTermsChange: (checked: boolean) => void
  onOptOutChange: (checked: boolean) => void
  /** Unique id prefix so email + profile steps do not clash. */
  idPrefix?: string
  /** Show the required Terms / Privacy agreement checkbox. */
  showTerms?: boolean
  className?: string
}

/**
 * Compare Bazaar white paper consent block (Terms + opt-out + privacy footer).
 * Brand: Compare Bazaar · accent: cb-orange.
 */
export function WhitePaperConsentBlock({
  termsAccepted,
  optOutCommunication,
  onTermsChange,
  onOptOutChange,
  idPrefix = 'wp',
  showTerms = true,
  className = '',
}: Props) {
  return (
    <div className={`space-y-3 ${className}`}>
      {showTerms ? (
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
            I agree to Compare Bazaar&apos;s{' '}
            <Link href="/terms-of-use" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Terms of Use
            </Link>
            ,{' '}
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Privacy Policy
            </Link>
            , and the transfer of my information to the United States for processing to provide me with
            relevant information as described in our{' '}
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      ) : null}

      <label className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
        <input
          id={`${idPrefix}-opt-out`}
          type="checkbox"
          checked={optOutCommunication}
          onChange={(e) => onOptOutChange(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-cb-orange"
        />
        <span>
          <span className="font-semibold text-gray-800">Optional:</span> check this box only if you want to{' '}
          <span className="font-semibold text-gray-800">opt out of further emails</span> from Compare Bazaar.
          Leave it unchecked to keep receiving relevant updates. Read our{' '}
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
            privacy statement
          </Link>
          .
        </span>
      </label>
    </div>
  )
}

export function WhitePaperConsentFooter() {
  return (
    <p className="mt-3 text-center text-[12px] leading-snug text-gray-600">
      I have read and understood privacy statement of{' '}
      <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
        Compare Bazaar
      </Link>
      .
    </p>
  )
}
