'use client'

export function CookiePreferencesTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('cookie-consent-open'))
      }}
    >
      Cookie preferences
    </button>
  )
}
