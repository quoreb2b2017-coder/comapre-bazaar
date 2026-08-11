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
import { MessageCircle, ShieldCheck, Target, Zap, type LucideIcon } from "lucide-react";

const PAGE_DEFAULTS: QuoteLandingContent = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Technology", href: "/technology" },
    { label: "Business Phone Systems", href: "/technology/business-phone-systems" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "VoIP & UCaaS quotes",
    description:
      "Describe installs vs replacements, handset counts, and collaboration habits once. Matched quotes align with our editorial shortlist (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage, RingCentral), plus comparable alternatives when helpful.",
    trustItems: [
      "Free quotes, no obligation",
      "SMB-friendly & mid-market UCaaS",
      "Independent methodology",
      "~24 hour vendor routing",
    ],
    stats: [
      { n: "8+", l: "Platforms Compared" },
      { n: "99.999%", l: "SLA leaders" },
      { n: "UCaaS", l: "Voice + meetings" },
      { n: "4.3★", l: "Top SMB ease (Ooma)" },
    ],
    vendors: [
      { name: "Ooma Office", dot: "#003087" },
      { name: "800.com", dot: "#FF6B35" },
      { name: "Zoom", dot: "#2D8CFF" },
      { name: "Nextiva", dot: "#FF6900" },
      { name: "Vonage", dot: "#00AEEF" },
      { name: "RingCentral", dot: "#FF8800" },
    ],
    vendorLabel: "Featured VoIP platforms on Compare Bazaar",
  },
  howItWorks: {
    tag: "How It Works",
    title: "Modern calling procurement in three beats",
    subtitle: "Scenario clarity → aligned UC bundles → pilots without redundant vendor theater.",
    steps: [
      {
        tag: "2 minutes",
        num: "01",
        title: "Frame your rollout",
        body: "Install vs swap vs expansion sets vendor expectations for hardware leases and managed cutovers.",
      },
      {
        tag: "Within 24 hours",
        num: "02",
        title: "Tailored UC quotes",
        body: "Responses emphasize Compare Bazaar editorial picks, Ooma, Nextiva, Zoom Phone, Vonage, RingCentral.",
      },
      {
        tag: "Ops-led",
        num: "03",
        title: "Pick winners quickly",
        body: "Compare unlimited domestic tiers, fax survivability, and CRM integrations side-by-side.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Teams that accelerated VoIP decisions",
    subtitle: "Hybrid workforce operators pairing Zoom ecosystems with PSTN reliability.",
    items: [
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
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Independent VoIP guidance",
    subtitle: "Hands-on testing drives shortlists, not vendor sponsorship lanes.",
    items: [
      {
        title: "Scenario-aware routing",
        body: "Whether you are installing, replacing, or expanding, vendors tailor UCaaS bundles instead of generic seat counts.",
      },
      {
        title: "Same brands we review",
        body: "Quick picks on Compare Bazaar (Ooma Office, 800.com, Zoom Phone, Nextiva, Vonage) anchor matched outreach.",
      },
      {
        title: "Quotes within ~24 hours",
        body: "Single intake replaces repetitive screening calls when procurement windows are tight.",
      },
      {
        title: "Guidance on integrations",
        body: "Need Teams handoff or CRM click-to-dial depth? Specialists decode proposal differences.",
      },
    ],
  },
  bottomCta: {
    title: "Ready for VoIP quotes?",
    subtitle: "Jump back up, three steps connect you with UC vendors matching our editorial roster.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function BusinessPhoneSystemGetQuotesForm({ heading, landingContent }: QuoteFormClientProps) {
  const content = mergeQuoteLandingContent(PAGE_DEFAULTS, landingContent);
  const whyItems = (content.whyCompare?.items || []).map((item, index) => ({
    icon: WHY_ICONS[index] || Target,
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
        formKey="business-phone"
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
