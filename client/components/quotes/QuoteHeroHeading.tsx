import { quoteHeroLineParts, splitQuoteHeroHeading } from '@/lib/quoteHeroHeading'

function QuoteHeroLine({ text, accent }: { text: string; accent?: string }) {
  const parts = quoteHeroLineParts(text, accent)
  if (!parts) {
    return <span className="quote-hero-title-line">{text}</span>
  }

  return (
    <span className="quote-hero-title-line">
      {parts.before}
      <span className="acc">{parts.accent}</span>
      {parts.after}
    </span>
  )
}

export function QuoteHeroHeading({ heading }: { heading: string }) {
  const { line1, line2, line1Accent, line2Accent } = splitQuoteHeroHeading(heading)

  return (
    <h1 className="quote-hero-title">
      <QuoteHeroLine text={line1} accent={line1Accent} />
      {line2 ? <QuoteHeroLine text={line2} accent={line2Accent} /> : null}
    </h1>
  )
}
