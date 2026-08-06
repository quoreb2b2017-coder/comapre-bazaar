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
import { Headphones, MessageCircle, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

const HOW_STEPS = [
  { tag: "3 min", num: "01", title: "Quantify workloads", body: "Agents, incumbent telephony, and monthly volume anchors realistic seat + consumption pricing." },
  { tag: "~24h", num: "02", title: "Matched vendors respond", body: "Proposals cite platforms from Compare Bazaar testing, SMB through AI-heavy enterprise suites." },
  { tag: "Pilot", num: "03", title: "Compare & negotiate", body: "IVR depth, QA, integrations, omnichannel parity, weighed side-by-side." },
];

const VENDORS = [
  { name: "GoTo", dot: "#6D4AFF" },
  { name: "RingCentral", dot: "#FF8800" },
  { name: "GoAnswer", dot: "#0EA5E9" },
  { name: "Twilio", dot: "#F22F46" },
  { name: "Salesforce", dot: "#00A1E0" },
  { name: "Talkdesk", dot: "#4F46E5" },
];

const TESTIMONIALS = [
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
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Headphones,
    title: "Channel-aware routing",
    body: "Agent totals + volume tiers steer proposals toward SMB ease, inbound-heavy CC, or API-first builds.",
  },
  {
    icon: ShieldCheck,
    title: "Same brands we test",
    body: "Editorial roster includes GoTo, RingCentral, GoAnswer, Twilio, Salesforce Service Cloud, Talkdesk, Genesys, Freshdesk.",
  },
  {
    icon: Zap,
    title: "Faster procurement",
    body: "One structured brief replaces duplicated vendor screening calls.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when unclear",
    body: "Inbound vs outsourced vs omnichannel expansions decoded before you demo.",
  },
];

type QuoteFormClientProps = { heading: string };

export default function CallCenterGetQuotesPage({ heading }: QuoteFormClientProps) {
  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sales", href: "/sales" },
          { label: "Best Call Center Software", href: "/sales/best-call-center-management-software" },
          { label: "Get Free Quotes" },
        ]}
      />

      <QuoteLandingHero
        eyebrow="Contact center quotes"
        heading={heading}
        description="Capture org size, live agent counts, incumbent stack, and call volume bands once, then receive proposals aligned with GoTo, RingCentral, Twilio, Salesforce, Talkdesk, Freshdesk CC, and the rest of our tested roster."
        trustItems={[
          "Free quotes · no obligation",
          "SMB through enterprise CX",
          "Independent methodology",
          "Fast routing",
        ]}
        stats={[
          { n: "9+", l: "Platforms Tested" },
          { n: "IVR+", l: "Omnichannel mixes" },
          { n: "AI QA", l: "Enterprise depth" },
          { n: "4.4★", l: "Inbound pick (RingCentral)" },
        ]}
        vendors={VENDORS}
        vendorLabel="Featured vendors from our call center comparison"
        formKey="call-center"
      />

      <QuoteHowItWorksSection
        tag="How It Works"
        title="Contact center sourcing in three steps"
        subtitle="Operations truth → scoped vendors → demos with finalists only."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that stabilized CX procurements"
        subtitle="Support leaders comparing turnkey CCaaS versus programmable stacks."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="CX tech without vendor bingo"
        subtitle="Editorially scored platforms, placements follow fit, not sponsorship."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Need call center vendor quotes?"
        subtitle="Jump to the sticky form, we'll mirror the stacks we already benchmarked."
      />
    </QuoteLandingPageShell>
  );
}
