import { cleanDisplayText } from '@/lib/cleanDisplayText'

const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  [/\bone of the strongest\b/gi, 'a strong'],
  [/\bone of the best\b/gi, 'a solid'],
  [/\bgenuinely useful\b/gi, 'actually useful'],
  [/\bcomprehensive\b/gi, 'full'],
  [/\brobust\b/gi, 'solid'],
  [/\bleverage\b/gi, 'use'],
  [/\butilize\b/gi, 'use'],
  [/\bdelve into\b/gi, 'look at'],
  [/\bin today['']s landscape\b/gi, 'right now'],
  [/\bstands out\b/gi, 'works well'],
  [/\bstreamline(s|d|ing)?\b/gi, 'simplify'],
  [/\bempower(s|ed|ing)?\b/gi, 'help'],
  [/\bseamless(ly)?\b/gi, 'smooth'],
  [/\bcutting-edge\b/gi, 'modern'],
  [/\bgame-changer\b/gi, 'big upgrade'],
  [/\binvaluable\b/gi, 'worth having'],
  [/\bholistic\b/gi, 'full-picture'],
  [/\bunlock(s|ed|ing)?\b/gi, 'get'],
  [/\bnavigate\b/gi, 'handle'],
  [/\blandscape\b/gi, 'market'],
  [/\bdeep dive\b/gi, 'close look'],
  [/\bend-to-end\b/gi, 'full'],
  [/\bworld-class\b/gi, 'strong'],
  [/\bbest-in-class\b/gi, 'top-tier'],
  [/\bpowerful solution\b/gi, 'capable tool'],
  [/\btailored to your needs\b/gi, 'matched to what you need'],
  [/\bno obligation\b/gi, 'no pressure'],
]

/** Light editorial pass: trim AI filler and em dashes for public review copy. */
export function humanizeReviewCopy(text: string): string {
  let s = cleanDisplayText(String(text || ''))
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    s = s.replace(pattern, replacement)
  }
  return s.replace(/\s{2,}/g, ' ').trim()
}

export type HumanizableReviewDetail = {
  summary: string
  onboarding: string
  automation: string
  pricingReality: string
  reviewer: string
  reviewerRole: string
  updatedOn: string
  publishedOn: string
  bestFor: string[]
  notIdealFor: string[]
  scorecard: { metric: string; score: string }[]
  faqs: { q: string; a: string }[]
}

export function humanizeReviewDetail<T extends HumanizableReviewDetail>(detail: T): T {
  return {
    ...detail,
    summary: humanizeReviewCopy(detail.summary),
    onboarding: humanizeReviewCopy(detail.onboarding),
    automation: humanizeReviewCopy(detail.automation),
    pricingReality: humanizeReviewCopy(detail.pricingReality),
    bestFor: detail.bestFor.map(humanizeReviewCopy),
    notIdealFor: detail.notIdealFor.map(humanizeReviewCopy),
    faqs: detail.faqs.map((f) => ({
      q: humanizeReviewCopy(f.q),
      a: humanizeReviewCopy(f.a),
    })),
  }
}
