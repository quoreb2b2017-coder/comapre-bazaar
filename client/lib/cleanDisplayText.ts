/** Remove em/en dashes from display copy; use commas instead. */
export function cleanDisplayText(text: string): string {
  return String(text || '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,{2,}/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s+/g, ', ')
    .trim()
}
