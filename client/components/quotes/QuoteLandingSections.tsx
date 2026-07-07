"use client";

import { Star, type LucideIcon } from "lucide-react";

export type QuoteHowStep = {
  tag: string;
  num: string;
  title: string;
  body: string;
};

export type QuoteTestimonial = {
  name: string;
  role: string;
  company: string;
  result: string;
  body: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
};

export type QuoteWhyItem = {
  title: string;
  body: string;
  icon: LucideIcon;
};

type SectionCopy = {
  tag: string;
  title: string;
  subtitle: string;
};

type QuoteHowItWorksSectionProps = SectionCopy & {
  steps: QuoteHowStep[];
};

export function QuoteHowItWorksSection({ tag, title, subtitle, steps }: QuoteHowItWorksSectionProps) {
  return (
    <div className="sec-alt">
      <section className="sec sec-compact">
        <div className="ct">
          <div className="stag">{tag}</div>
          <h2 className="sh">{title}</h2>
          <p className="ssub">{subtitle}</p>
          <div className="howg">
            {steps.map((step) => (
              <div key={step.num} className="hc">
                <span className="howt">{step.tag}</span>
                <div className="hwn">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

type QuoteTestimonialsSectionProps = SectionCopy & {
  testimonials: QuoteTestimonial[];
};

export function QuoteTestimonialsSection({ tag, title, subtitle, testimonials }: QuoteTestimonialsSectionProps) {
  return (
    <section className="sec">
      <div className="ct">
        <div className="stag">{tag}</div>
        <h2 className="sh">{title}</h2>
        <p className="ssub">{subtitle}</p>
        <div className="tg">
          {testimonials.map((t) => (
            <div key={t.name} className="tc">
              <span className="rtag">✓ {t.result}</span>
              <div className="tstars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="#FBBF24" color="#FBBF24" strokeWidth={0} aria-hidden />
                ))}
              </div>
              <p className="tbody">&ldquo;{t.body}&rdquo;</p>
              <div className="ta">
                <div className="av" style={{ background: t.avatarBg, color: t.avatarText }}>
                  {t.initials}
                </div>
                <div>
                  <div className="an">{t.name}</div>
                  <div className="ar">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type QuoteWhyCompareSectionProps = SectionCopy & {
  items: QuoteWhyItem[];
};

export function QuoteWhyCompareSection({ tag, title, subtitle, items }: QuoteWhyCompareSectionProps) {
  return (
    <div className="sec-alt">
      <section className="sec sec-compact">
        <div className="ct">
          <div className="stag">{tag}</div>
          <h2 className="sh">{title}</h2>
          <p className="ssub">{subtitle}</p>
          <div className="whyg">
            {items.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="wc">
                  <div className="wi">
                    <Icon aria-hidden />
                  </div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

type QuoteBottomCtaProps = {
  title: string;
  subtitle: string;
  buttonLabel?: string;
};

export function QuoteBottomCta({ title, subtitle, buttonLabel = "Get Free Quotes →" }: QuoteBottomCtaProps) {
  return (
    <div className="ct">
      <div className="cta-band">
        <div className="cta-band-copy">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <a
          href="#quote-form"
          className="btn-wh"
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById("quote-form");
            if (target) {
              const top = target.getBoundingClientRect().top + window.scrollY - 96;
              window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
              return;
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}
