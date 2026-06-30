export type WhitePaperResourceType = 'whitepaper' | 'report'

export function whitePaperResourceType(metadata?: { resourceType?: string } | null): WhitePaperResourceType {
  return metadata?.resourceType === 'report' ? 'report' : 'whitepaper'
}

export function whitePaperResourceLabel(type: WhitePaperResourceType): string {
  return type === 'report' ? 'Report' : 'Whitepaper'
}
