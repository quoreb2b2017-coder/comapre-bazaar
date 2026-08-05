import {
  normalizeWhitePaperResourceType,
  whitePaperResourceLabel,
  type WhitePaperResourceType,
} from '@/lib/whitePaperTaxonomy'

export type { WhitePaperResourceType }

export function whitePaperResourceType(metadata?: { resourceType?: string } | null): WhitePaperResourceType {
  return normalizeWhitePaperResourceType(metadata?.resourceType)
}

export { whitePaperResourceLabel }
