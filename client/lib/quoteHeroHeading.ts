export type QuoteHeroHeadingSplit = {
  line1: string
  line2?: string
  line1Accent?: string
  line2Accent?: string
}

function renderAccentParts(text: string, accent?: string): { before: string; accent: string; after: string } | null {
  if (!accent || !text.includes(accent)) return null
  const idx = text.indexOf(accent)
  return {
    before: text.slice(0, idx),
    accent,
    after: text.slice(idx + accent.length),
  }
}

export function splitQuoteHeroHeading(heading: string): QuoteHeroHeadingSplit {
  const trimmed = heading.trim()

  const findTheRight = trimmed.match(/^Find the Right\s+(.+?)\s+for\s+(Your Team)$/i)
  if (findTheRight) {
    return {
      line1: 'Find the Right',
      line2: `${findTheRight[1]} for ${findTheRight[2]}`,
      line2Accent: findTheRight[2],
    }
  }

  const forYourTeam = trimmed.match(/^(.+?)\s+for\s+(Your Team)$/i)
  if (forYourTeam) {
    return {
      line1: forYourTeam[1],
      line2: `for ${forYourTeam[2]}`,
      line2Accent: forYourTeam[2],
    }
  }

  const vendorQuote = trimmed.match(/^(Get a Free .+? Quote)\s+from\s+(.+)$/i)
  if (vendorQuote) {
    return {
      line1: vendorQuote[1],
      line2: `from ${vendorQuote[2]}`,
      line2Accent: vendorQuote[2],
    }
  }

  const freeQuotes = trimmed.match(/^Get Free Quotes\s+(.+)$/i)
  if (freeQuotes) {
    return {
      line1: 'Get Free Quotes',
      line1Accent: 'Free Quotes',
      line2: freeQuotes[1],
    }
  }

  const words = trimmed.split(/\s+/)
  if (words.length <= 6) {
    return { line1: trimmed }
  }

  const mid = Math.ceil(words.length / 2)
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  }
}

export function quoteHeroLineParts(text: string, accent?: string) {
  return renderAccentParts(text, accent)
}
