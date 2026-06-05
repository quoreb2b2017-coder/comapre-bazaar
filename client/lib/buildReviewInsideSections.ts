export type ReviewInsideSection = {
  id: string
  title: string
  summary: string
  body: string
  blocks?: { title: string; body: string }[]
}

function truncate(text: string, max = 110): string {
  const t = String(text || '').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

type BuildInput = {
  reviewName: string
  summary?: string
  onboarding?: string
  automation?: string
  pricingReality?: string
  featureBreakdown?: { title: string; body: string }[]
  bestFor?: string[]
  tagline?: string
  pros?: string[]
}

export function buildReviewInsideSections(input: BuildInput): ReviewInsideSection[] {
  const sections: ReviewInsideSection[] = []

  if (input.summary?.trim()) {
    sections.push({
      id: 'summary',
      title: 'Executive summary',
      summary: truncate(input.summary),
      body: input.summary.trim(),
    })
  }

  if (input.onboarding?.trim()) {
    sections.push({
      id: 'onboarding',
      title: 'Setup and usability',
      summary: truncate(input.onboarding),
      body: input.onboarding.trim(),
    })
  }

  if (input.automation?.trim()) {
    sections.push({
      id: 'automation',
      title: 'Core capabilities',
      summary: truncate(input.automation),
      body: input.automation.trim(),
    })
  }

  if (input.pricingReality?.trim()) {
    sections.push({
      id: 'pricing',
      title: 'Pricing reality',
      summary: truncate(input.pricingReality),
      body: input.pricingReality.trim(),
    })
  }

  if (input.featureBreakdown?.length) {
    const blocks = input.featureBreakdown.slice(0, 3)
    sections.push({
      id: 'features',
      title: 'Feature highlights',
      summary: truncate(blocks[0]?.body || blocks[0]?.title || ''),
      body: blocks.map((b) => b.body).join('\n\n'),
      blocks,
    })
  }

  if (input.bestFor?.length) {
    sections.push({
      id: 'best-fit',
      title: 'Who should choose this',
      summary: truncate(input.bestFor[0]),
      body: input.bestFor.map((item) => `• ${item}`).join('\n'),
    })
  }

  if (sections.length === 0) {
    const fallback = input.tagline?.trim() || input.pros?.[0]?.trim() || `${input.reviewName} review overview.`
    sections.push({
      id: 'overview',
      title: 'Overview',
      summary: truncate(fallback),
      body: fallback,
    })
  }

  return sections.slice(0, 6)
}
