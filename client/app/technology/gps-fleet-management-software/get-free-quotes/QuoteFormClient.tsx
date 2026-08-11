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
    { label: "Fleet Management Software", href: "/technology/gps-fleet-management-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "Fleet telematics quotes",
    description:
      "Capture fleet size and dominant vehicle types once. We route requests toward Motive, Teletrac Navman, Verizon Connect, Samsara, Surecam, Fleetio, and aligned alternatives from our 2026 fleet management software guide.",
    trustItems: [
      "Free quotes, no obligation",
      "Real-time GPS + safety stacks",
      "Editorially independent methodology",
      "~24 hour vendor alignment",
    ],
    stats: [
      { n: "7+", l: "Platforms Compared" },
      { n: "ELD", l: "Compliance paths" },
      { n: "AI safety", l: "Dashcam leaders" },
      { n: "4.6★", l: "Top overall (Samsara)" },
    ],
    vendors: [
      { name: "Motive", dot: "#00C853" },
      { name: "Teletrac Navman", dot: "#003366" },
      { name: "Verizon Connect", dot: "#E62129" },
      { name: "Samsara", dot: "#111827" },
      { name: "Surecam", dot: "#2563EB" },
      { name: "Fleetio", dot: "#10B981" },
    ],
    vendorLabel: "Featured fleet platforms on Compare Bazaar",
  },
  howItWorks: {
    tag: "How It Works",
    title: "From fleet intake to vendor pilots",
    subtitle: "Operational truth → aligned GPS proposals → hardware/software pilots only where ROI is clear.",
    steps: [
      {
        tag: "3 minutes",
        num: "01",
        title: "Define fleet reality",
        body: "Asset counts, dominant vehicle classes, and ZIP anchoring help vendors quote hardware + SaaS accurately.",
      },
      {
        tag: "Same-day routing",
        num: "02",
        title: "Matched telematics stacks",
        body: "Responses emphasize platforms from our comparison matrix, Samsara, Motive, Verizon Connect, Fleetio, etc.",
      },
      {
        tag: "Ops-led",
        num: "03",
        title: "Deploy at your cadence",
        body: "Compare bundled dashcam + GPS vs maintenance-first stacks before signing contracts.",
      },
    ],
  },
  testimonials: {
    tag: "Fleet Buyer Stories",
    title: "Operations teams that de-risked telematics buys",
    subtitle: "Mixed-duty fleets translating GPS quotes into measurable idle & safety gains.",
    items: [
      {
        name: "Greg Dalton",
        role: "Fleet Director",
        company: "Summit Freight Co.",
        result: "ELD + GPS quotes aligned to lane mix",
        body: "We described rigs versus vans once, and responders quoted hardware bundles that matched duty cycles instead of generic per-seat SaaS.",
        initials: "GD",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Renee Wallace",
        role: "Ops Lead",
        company: "Urban Plumbing Collective",
        result: "Cut idle miles ~11% post rollout",
        body: "Shortlisted vendors understood municipal routing constraints from the intake fields.",
        initials: "RW",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Omar Haddad",
        role: "VP Ops",
        company: "Desert Bulk Transport",
        result: "Safety scoring surfaced comparable dashboards",
        body: "We needed coaching visibility across two terminals, and proposals referenced tools like Samsara and Motive without guesswork.",
        initials: "OH",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Fleet-grade independence",
    subtitle: "Hands-on telematics scoring informs who enters your quote pool, not sponsorship slots.",
    items: [
      {
        title: "Matched fleet archetype",
        body: "Fleet size and vehicle types steer quotes toward telematics depth that fits mixed-duty or maintenance-led fleets.",
      },
      {
        title: "Independent Compare Bazaar picks",
        body: "Vendor rankings follow editorial testing, placements here mirror Motive, Verizon Connect, Samsara, Fleetio, and peers from our guide.",
      },
      {
        title: "Quotes within ~24 hours",
        body: "Single intake replaces repetitive vendor screening calls early in procurement.",
      },
      {
        title: "Guidance on modules",
        body: "Unclear if you need AI dashcam bundles vs maintenance-first stacks? Specialists clarify trade-offs.",
      },
    ],
  },
  bottomCta: {
    title: "Ready for fleet management quotes?",
    subtitle: "Scroll up, finish three quick steps, and compare aligned vendors.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function GPSFleetGetQuotesForm({ heading, landingContent }: QuoteFormClientProps) {
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
        formKey="gps-fleet"
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
