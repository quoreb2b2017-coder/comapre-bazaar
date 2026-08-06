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
import { MessageCircle, ShieldCheck, Target, Zap, type LucideIcon } from "lucide-react";

const HOW_STEPS = [
  { tag: "2 minutes", num: "01", title: "Frame your rollout", body: "Install vs swap vs expansion sets vendor expectations for hardware leases and managed cutovers." },
  { tag: "Within 24 hours", num: "02", title: "Tailored UC quotes", body: "Responses emphasize Compare Bazaar editorial picks, Ooma, Nextiva, Zoom Phone, Vonage, RingCentral." },
  { tag: "Ops-led", num: "03", title: "Pick winners quickly", body: "Compare unlimited domestic tiers, fax survivability, and CRM integrations side-by-side." },
];

const VENDORS = [
  { name: "Ooma Office", dot: "#003087" },
  { name: "800.com", dot: "#FF6B35" },
  { name: "Zoom", dot: "#2D8CFF" },
  { name: "Nextiva", dot: "#FF6900" },
  { name: "Vonage", dot: "#00AEEF" },
  { name: "RingCentral", dot: "#FF8800" },
];

const TESTIMONIALS = [
  {
    name: "Lin Zhao",
    role: "IT Manager",
    company: "Atlas Dental Group",
    result: "Cut Telco bill 22% after VoIP bake-off",
    body: "We flagged replacing legacy PBX plus hybrid Zoom usage, and proposals referenced Nextiva and Ooma tiers that matched desk + softphone split.",
    initials: "LZ",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Marcus Webb",
    role: "COO",
    company: "BrightLine Legal",
    result: "Ported numbers inside SLA",
    body: "Teams feared downtime; matched RingCentral + Vonage quotes spelled cutover windows explicitly.",
    initials: "MW",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Valeria Ortiz",
    role: "Rev Ops",
    company: "Pulse CX Studio",
    result: "Unified UCaaS trial in 10 days",
    body: "Quote grid compared unlimited domestic calling vs bolt-on international, which matched how we actually operate.",
    initials: "VO",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Scenario-aware routing",
    body: "Whether you are installing, replacing, or expanding, vendors tailor UCaaS bundles instead of generic seat counts.",
  },
  {
    icon: ShieldCheck,
    title: "Same brands we review",
    body: "Quick picks on Compare Bazaar (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage) anchor matched outreach.",
  },
  {
    icon: Zap,
    title: "Quotes within ~24 hours",
    body: "Single intake replaces repetitive screening calls when procurement windows are tight.",
  },
  {
    icon: MessageCircle,
    title: "Guidance on integrations",
    body: "Need Teams handoff or CRM click-to-dial depth? Specialists decode proposal differences.",
  },
];

type QuoteFormClientProps = { heading: string };

export default function BusinessPhoneSystemGetQuotesForm({ heading }: QuoteFormClientProps) {
  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Technology", href: "/technology" },
          { label: "Business Phone Systems", href: "/technology/business-phone-systems" },
          { label: "Get Free Quotes" },
        ]}
      />

      <QuoteLandingHero
        eyebrow="VoIP & UCaaS quotes"
        heading={heading}
        description="Describe installs vs replacements, handset counts, and collaboration habits once. Matched quotes align with our editorial shortlist (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage, RingCentral), plus comparable alternatives when helpful."
        trustItems={[
          "Free quotes, no obligation",
          "SMB-friendly & mid-market UCaaS",
          "Independent methodology",
          "~24 hour vendor routing",
        ]}
        stats={[
          { n: "8+", l: "Platforms Compared" },
          { n: "99.999%", l: "SLA leaders" },
          { n: "UCaaS", l: "Voice + meetings" },
          { n: "4.3★", l: "Top SMB ease (Ooma)" },
        ]}
        vendors={VENDORS}
        vendorLabel="Featured VoIP platforms on Compare Bazaar"
        formKey="business-phone"
      />

      <QuoteHowItWorksSection
        tag="How It Works"
        title="Modern calling procurement in three beats"
        subtitle="Scenario clarity → aligned UC bundles → pilots without redundant vendor theater."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that accelerated VoIP decisions"
        subtitle="Hybrid workforce operators pairing Zoom ecosystems with PSTN reliability."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Independent VoIP guidance"
        subtitle="Hands-on testing drives shortlists, not vendor sponsorship lanes."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready for VoIP quotes?"
        subtitle="Jump back up, three steps connect you with UC vendors matching our editorial roster."
      />
    </QuoteLandingPageShell>
  );
}
