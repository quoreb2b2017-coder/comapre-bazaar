import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at 10% 0%, #ffe9d2 0%, #fff6ee 36%, #ffffff 70%), linear-gradient(135deg, #fffaf4 0%, #ffffff 100%)',
          padding: '60px 72px',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 999,
            border: '1px solid #f3c79b',
            background: '#fff3e7',
            color: '#d86e1e',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 0.4,
            padding: '10px 18px',
          }}
        >
          Compare Bazaar
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.03, letterSpacing: -1.6 }}>
            Business Software
          </div>
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.9 }}>
            Comparisons & Reviews
          </div>
          <div style={{ fontSize: 30, color: '#475569' }}>
            Independent buying guides for growing teams
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 25, color: '#64748b' }}>
          <div>CRM · Marketing · Sales · HR · Technology</div>
          <div>compare-bazaar.com</div>
        </div>
      </div>
    ),
    size
  )
}
