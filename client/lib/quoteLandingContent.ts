export type QuoteLandingStep = {
  tag: string
  num: string
  title: string
  body: string
}

export type QuoteLandingTestimonial = {
  name: string
  role: string
  company: string
  result: string
  body: string
  initials: string
  avatarBg: string
  avatarText: string
}

export type QuoteLandingWhyItem = {
  title: string
  body: string
}

export type QuoteLandingContent = {
  hero?: {
    eyebrow?: string
    description?: string
    trustItems?: string[]
    stats?: { n: string; l: string }[]
    vendorLabel?: string
    vendors?: { name: string; dot: string }[]
  }
  howItWorks?: {
    tag?: string
    title?: string
    subtitle?: string
    steps?: QuoteLandingStep[]
  }
  testimonials?: {
    tag?: string
    title?: string
    subtitle?: string
    items?: QuoteLandingTestimonial[]
  }
  whyCompare?: {
    tag?: string
    title?: string
    subtitle?: string
    items?: QuoteLandingWhyItem[]
  }
  bottomCta?: {
    title?: string
    subtitle?: string
  }
  breadcrumbs?: { label: string; href?: string }[]
}

/** Deep-merge CMS overrides onto page defaults (icons etc. stay from defaults). */
export function mergeQuoteLandingContent<T extends QuoteLandingContent>(
  defaults: T,
  cms?: QuoteLandingContent | null
): T {
  if (!cms) return defaults

  const mergedWhyItems =
    cms.whyCompare?.items?.length && defaults.whyCompare?.items?.length
      ? defaults.whyCompare.items.map((item, index) => ({
          ...item,
          ...(cms.whyCompare?.items?.[index] || {}),
        }))
      : cms.whyCompare?.items?.length
        ? cms.whyCompare.items
        : defaults.whyCompare?.items

  return {
    ...defaults,
    hero: cms.hero ? { ...defaults.hero, ...cms.hero } : defaults.hero,
    howItWorks: cms.howItWorks
      ? {
          ...defaults.howItWorks,
          ...cms.howItWorks,
          steps: cms.howItWorks.steps?.length ? cms.howItWorks.steps : defaults.howItWorks?.steps,
        }
      : defaults.howItWorks,
    testimonials: cms.testimonials
      ? {
          ...defaults.testimonials,
          ...cms.testimonials,
          items: cms.testimonials.items?.length ? cms.testimonials.items : defaults.testimonials?.items,
        }
      : defaults.testimonials,
    whyCompare: cms.whyCompare
      ? {
          ...defaults.whyCompare,
          ...cms.whyCompare,
          items: mergedWhyItems,
        }
      : defaults.whyCompare,
    bottomCta: cms.bottomCta ? { ...defaults.bottomCta, ...cms.bottomCta } : defaults.bottomCta,
    breadcrumbs: cms.breadcrumbs?.length ? cms.breadcrumbs : defaults.breadcrumbs,
  }
}
