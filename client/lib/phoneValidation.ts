/** Shared phone validation for quote / lead forms */

export const PHONE_PLACEHOLDER = '+1 332 231 0404'

export const PHONE_VALIDATION_MESSAGE =
  'Enter a valid phone number with country code (e.g. +1 332 231 0404 or 3322310404)'

/** Allow +, digits, spaces, dashes, and parentheses while typing */
export function sanitizePhoneInput(value: string): string {
  let v = String(value ?? '')
  const hasLeadingPlus = v.trimStart().startsWith('+')
  v = v.replace(/[^\d+\s()-]/g, '')
  if (hasLeadingPlus) {
    return `+${v.replace(/\+/g, '')}`
  }
  return v.replace(/\+/g, '')
}

/**
 * Accept common international formats:
 * - 10–15 digits (US local, US with leading 1, most country codes)
 * - Optional leading +; spaces/dashes/parens ignored
 */
export function isValidPhoneNumber(value: string): boolean {
  const raw = String(value ?? '').trim()
  if (!raw) return false

  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return false

  if (raw.startsWith('+')) {
    return /^[1-9]\d{9,14}$/.test(digits)
  }

  return true
}

/** True when user typed something but it fails validation */
export function phoneHasError(value: string): boolean {
  const raw = String(value ?? '').trim()
  if (!raw) return false
  return !isValidPhoneNumber(raw)
}
