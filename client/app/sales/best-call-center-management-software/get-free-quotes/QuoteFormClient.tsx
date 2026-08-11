"use client";

import { QuoteBreadcrumb } from "@/components/quotes/QuoteBreadcrumb";
import {
  QuoteBottomCta,
  QuoteHowItWorksSection,
  QuoteTestimonialsSection,
  QuoteWhyCompareSection,
} from "@/components/quotes/QuoteLandingSections";
import { QuoteLandingHero } from "@/components/quotes/QuoteLandingHero";
import { QuoteLandingPageShell } from "@/components/quotes/QuoteLandingPageShell";
import { mergeQuoteLandingContent, type QuoteLandingContent } from "@/lib/quoteLandingContent";
import { Headphones, MessageCircle, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

const PAGE_DEFAULTS: QuoteLandingContent = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Sales", href: "/sales" },
    { label: "Best Call Center Software", href: "/sales/best-call-center-management-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "Contact center quotes",
    description:
      "Capture org size, live agent counts, incumbent stack, and call volume bands once, then receive proposals aligned with GoTo, RingCentral, Twilio, Salesforce, Talkdesk, Freshdesk CC, and the rest of our tested roster.",
    trustItems: [
      "Free quotes · no obligation",
      "SMB through enterprise CX",
      "Independent methodology",
      "Fast routing",
    ],
    stats: [
      { n: "9+", l: "Platforms Tested" },
      { n: "IVR+", l: "Omnichannel mixes" },
      { n: "AI QA", l: "Enterprise depth" },
      { n: "4.4★", l: "Inbound pick (RingCentral)" },
    ],
    vendors: [
      { name: "GoTo", dot: "#6D4AFF" },
      { name: "RingCentral", dot: "#FF8800" },
      { name: "GoAnswer", dot: "#0EA5E9" },
      { name: "Twilio", dot: "#F22F46" },
      { name: "Salesforce", dot: "#00A1E0" },
      { name: "Talkdesk", dot: "#4F46E5" },
    ],
    vendorLabel: "Featured vendors from our call center comparison",
  },
  howItWorks: {
    tag: "How It Works",
    title: "Contact center sourcing in three steps",
    subtitle: "Operations truth → scoped vendors → demos with finalists only.",
    steps: [
      {
        tag: "3 min",
        num: "01",
        title: "Quantify workloads",
        body: "Agents, incumbent telephony, and monthly volume anchors realistic seat + consumption pricing.",
      },
      {
        tag: "~24h",
        num: "02",
        title: "Matched vendors respond",
        body: "Proposals cite platforms from Compare Bazaar testing, SMB through AI-heavy enterprise suites.",
      },
      {
        tag: "Pilot",
        num: "03",
        title: "Compare & negotiate",
        body: "IVR depth, QA, integrations, omnichannel parity, weighed side-by-side.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Teams that stabilized CX procurements",
    subtitle: "Support leaders comparing turnkey CCaaS versus programmable stacks.",
    items: [
      {
        name: "Priya Shah",
        role: "CX Director",
        company: "LumenCare Health",
        result: "RingCentral vs Genesys clarity in days",
        body: "Agent counts plus monthly volume narrowed AI QA stacks vs budget SMB tiers without vendor noise.",
        initials: "PS",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Devon Reyes",
        role: "Operations",
        company: "CopperPeak Retail",
        result: "Omnichannel pilot scoped correctly",
        body: "We flagged upgrade path from basic phones, and responders quoted Talkdesk-esque depth only where warranted.",
        initials: "DR",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Kate Liang",
        role: "IT Lead",
        company: "Horizon SaaS Support",
        result: "API-first Twilio option alongside turnkey CC",
        body: "Engineering-led roadmap needed programmable voice, comparisons surfaced both build and buy bundles.",
        initials: "KL",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "CX tech without vendor bingo",
    subtitle: "Editorially scored platforms, placements follow fit, not sponsorship.",
    items: [
      {
        title: "Channel-aware routing",
        body: "Agent totals + volume tiers steer proposals toward SMB ease, inbound-heavy CC, or API-first builds.",
      },
      {
        title: "Same brands we test",
        body: "Editorial roster includes GoTo, RingCentral, GoAnswer, Twilio, Salesforce Service Cloud, Talkdesk, Genesys, Freshdesk.",
      },
      {
        title: "Faster procurement",
        body: "One structured brief replaces duplicated vendor screening calls.",
      },
      {
        title: "Guidance when unclear",
        body: "Inbound vs outsourced vs omnichannel expansions decoded before you demo.",
      },
    ],
  },
  bottomCta: {
    title: "Need call center vendor quotes?",
    subtitle: "Jump to the sticky form, we'll mirror the stacks we already benchmarked.",
  },
};

const WHY_ICONS: LucideIcon[] = [Headphones, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function CallCenterGetQuotesPage({ heading, landingContent }: QuoteFormClientProps) {
  const content = mergeQuoteLandingContent(PAGE_DEFAULTS, landingContent);
  const whyItems = (content.whyCompare?.items || []).map((item, index) => ({
    icon: WHY_ICONS[index] || Headphones,
    title: item.title,
    body: item.body,
  }));

  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb items={content.breadcrumbs || PAGE_DEFAULTS.breadcrumbs!} />

      <QuoteLandingHero
        eyebrow={content.hero?.eyebrow || ""}
        heading={heading}
        description={content.hero?.description || ""}
        trustItems={content.hero?.trustItems || []}
        stats={content.hero?.stats || []}
        vendors={content.hero?.vendors || []}
        vendorLabel={content.hero?.vendorLabel || ""}
        formKey="call-center"
      />

      <QuoteHowItWorksSection
        tag={content.howItWorks?.tag || ""}
        title={content.howItWorks?.title || ""}
        subtitle={content.howItWorks?.subtitle || ""}
        steps={content.howItWorks?.steps || []}
      />

      <QuoteTestimonialsSection
        tag={content.testimonials?.tag || ""}
        title={content.testimonials?.title || ""}
        subtitle={content.testimonials?.subtitle || ""}
        testimonials={content.testimonials?.items || []}
      />

      <QuoteWhyCompareSection
        tag={content.whyCompare?.tag || ""}
        title={content.whyCompare?.title || ""}
        subtitle={content.whyCompare?.subtitle || ""}
        items={whyItems}
      />

      <QuoteBottomCta
        title={content.bottomCta?.title || ""}
        subtitle={content.bottomCta?.subtitle || ""}
      />
    </QuoteLandingPageShell>
  );
}
