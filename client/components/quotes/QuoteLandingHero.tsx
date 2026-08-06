import { QuoteHeroHeading } from '@/components/quotes/QuoteHeroHeading'
import { QuoteLandingHeroForm } from '@/components/quotes/QuoteLandingHeroForm'
import type { QuoteLandingFormKey } from '@/lib/quoteLandingFormRegistry'

type Stat = { n: string; l: string }
type Vendor = { name: string; dot: string }

export type QuoteLandingHeroProps = {
  eyebrow: string
  heading: string
  description: string
  trustItems: string[]
  stats: Stat[]
  vendors: Vendor[]
  vendorLabel: string
  formKey: QuoteLandingFormKey
}

export function QuoteLandingHero({
  eyebrow,
  heading,
  description,
  trustItems,
  stats,
  vendors,
  vendorLabel,
  formKey,
}: QuoteLandingHeroProps) {
  return (
    <div className="hero-shell">
      <div className="hero">
        <div className="ct">
          <div className="hg">
            <div className="quote-hero-copy">
              <div className="eyebrow">
                <span className="edot" aria-hidden />
                {eyebrow}
              </div>
              <QuoteHeroHeading heading={heading} />
              <p className="hdesc">{description}</p>
              <ul className="trust-ul">
                {trustItems.map((t) => (
                  <li key={t} className="trust-li">
                    <span className="chk" aria-hidden>
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="stats">
                {stats.map((s) => (
                  <div key={s.l} className="sc">
                    <div className="sn">{s.n}</div>
                    <div className="sl">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="vrow">
                <div className="vlabel">{vendorLabel}</div>
                <div className="vpills">
                  {vendors.map((v) => (
                    <div key={v.name} className="vp">
                      <span className="vdot" style={{ background: v.dot }} aria-hidden />
                      {v.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <QuoteLandingHeroForm formKey={formKey} />
          </div>
        </div>
      </div>
    </div>
  )
}
