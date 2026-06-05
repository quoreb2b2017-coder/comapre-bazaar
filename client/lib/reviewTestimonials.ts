import type { WhitePaperTestimonial } from '@/components/whitepaper/WhitePaperTestimonials'

function pickCategoryKey(categoryPath: string): string {
  const path = categoryPath.toLowerCase()
  if (path.includes('gps-fleet')) return 'gps'
  if (path.includes('payroll') || path.includes('deel') || path.includes('papaya')) return 'payroll'
  if (path.includes('employee-management')) return 'employee'
  if (path.includes('call-center')) return 'callcenter'
  if (path.includes('project-management')) return 'project'
  if (path.includes('business-phone') || path.includes('voip')) return 'voip'
  if (path.includes('email-marketing')) return 'email'
  if (path.includes('website-building')) return 'website'
  if (path.includes('crm')) return 'crm'
  return 'general'
}

const TEMPLATES: Record<string, [WhitePaperTestimonial, WhitePaperTestimonial]> = {
  gps: [
    {
      quote:
        'The pricing and ROI notes helped us catch hardware add-ons before renewal. Saved us from a rough budget conversation with finance.',
      name: 'Darren M.',
      initials: 'DM',
      role: 'Fleet Operations Manager',
      company: 'Regional distribution company',
    },
    {
      quote:
        'We used the fleet-size guidance to validate volume discounts our vendor never mentioned. Short read, practical numbers.',
      name: 'Priya S.',
      initials: 'PS',
      role: 'Head of Logistics',
      company: 'Construction materials supplier',
    },
  ],
  payroll: [
    {
      quote:
        'Clear on compliance depth and where pricing jumps. We narrowed to two payroll vendors in one working session.',
      name: 'Nina R.',
      initials: 'NR',
      role: 'HR Operations Lead',
      company: 'Multi-state services firm',
    },
    {
      quote:
        'The setup and tax filing sections matched what our accountant cared about. Much faster than reading vendor decks.',
      name: 'Marcus T.',
      initials: 'MT',
      role: 'Finance Manager',
      company: 'Growing SMB',
    },
  ],
  crm: [
    {
      quote:
        'The workflow and adoption notes were honest. We skipped a flashy CRM and picked one our reps would actually use.',
      name: 'Alison K.',
      initials: 'AK',
      role: 'Sales Operations Manager',
      company: 'B2B SaaS team',
    },
    {
      quote:
        'Pricing reality section flagged add-ons early. That alone made the review worth reading before we signed.',
      name: 'Dev P.',
      initials: 'DP',
      role: 'RevOps Lead',
      company: 'Mid-market services company',
    },
  ],
  general: [
    {
      quote:
        'Structured like a buyer brief, not marketing fluff. We used it to align stakeholders before requesting demos.',
      name: 'Jordan L.',
      initials: 'JL',
      role: 'Operations Manager',
      company: 'Regional business',
    },
    {
      quote:
        'Short sections, clear trade-offs. Easier to share internally than a 20-page vendor PDF.',
      name: 'Sam W.',
      initials: 'SW',
      role: 'Team Lead',
      company: 'Scaling SMB',
    },
  ],
}

export function getReviewTestimonials(
  categoryPath: string,
  productName: string
): WhitePaperTestimonial[] {
  const key = pickCategoryKey(categoryPath)
  const pair = TEMPLATES[key] ?? TEMPLATES.general
  const name = productName.trim()

  return pair.map((item) => ({
    ...item,
    quote: item.quote.replace(/\{product\}/g, name),
  }))
}
