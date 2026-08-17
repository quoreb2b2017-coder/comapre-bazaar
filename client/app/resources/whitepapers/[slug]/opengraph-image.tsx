import { ImageResponse } from 'next/og'
import { fetchWhitePaperBySlug } from '@/lib/whitePaperCms.server'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import { whitePaperFreeBadgeLabel, whitePaperOgCtaLabel, whitePaperResourceLabel } from '@/lib/whitePaperTaxonomy'
import { whitePaperResourceType } from '@/lib/whitePaperResourceType'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

type Props = { params: { slug: string } }

export default async function WhitePaperOpengraphImage({ params }: Props) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  const title = paper
    ? whitePaperDisplayTitle(paper.title, paper.metaTitle || paper.seoTitle || paper.title)
    : 'Compare Bazaar resource'
  const cover = String(paper?.thumbnailUrl || '').trim()
  const heading = title.length > 90 ? `${title.slice(0, 89)}…` : title
  const resourceType = whitePaperResourceType(paper?.metadata)
  const badge = whitePaperFreeBadgeLabel(resourceType)
  const cta = whitePaperOgCtaLabel(resourceType)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #07183F 0%, #0B2A6F 55%, #123A8A 100%)',
          color: '#ffffff',
          padding: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 340,
            height: 534,
            borderRadius: 18,
            overflow: 'hidden',
            background: '#F4F6FA',
            border: '8px solid rgba(255,255,255,0.18)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          {cover ? (
            // ImageResponse requires a native img, not next/image
            <img
              src={cover}
              alt=""
              width={324}
              height={518}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: '#0B2A6F',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {whitePaperResourceLabel(resourceType)}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            paddingLeft: 48,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              background: '#F58220',
              color: '#ffffff',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              borderRadius: 999,
              padding: '10px 18px',
            }}
          >
              {badge}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                fontSize: heading.length > 60 ? 42 : 50,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: -1,
              }}
            >
              {heading}
            </div>
            <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.78)', lineHeight: 1.35 }}>
              Independent research from Compare Bazaar
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>compare-bazaar.com</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 999,
                padding: '8px 16px',
              }}
            >
              {cta}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
