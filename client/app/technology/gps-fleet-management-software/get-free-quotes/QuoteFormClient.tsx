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
  { tag: "3 minutes", num: "01", title: "Define fleet reality", body: "Asset counts, dominant vehicle classes, and ZIP anchoring help vendors quote hardware + SaaS accurately." },
  { tag: "Same-day routing", num: "02", title: "Matched telematics stacks", body: "Responses emphasize platforms from our comparison matrix, Samsara, Motive, Verizon Connect, Fleetio, etc." },
  { tag: "Ops-led", num: "03", title: "Deploy at your cadence", body: "Compare bundled dashcam + GPS vs maintenance-first stacks before signing contracts." },
];

const VENDORS = [
  { name: "Motive", dot: "#00C853" },
  { name: "Teletrac Navman", dot: "#003366" },
  { name: "Verizon Connect", dot: "#E62129" },
  { name: "Samsara", dot: "#111827" },
  { name: "Surecam", dot: "#2563EB" },
  { name: "Fleetio", dot: "#10B981" },
];

const TESTIMONIALS = [
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
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched fleet archetype",
    body: "Fleet size and vehicle types steer quotes toward telematics depth that fits mixed-duty or maintenance-led fleets.",
  },
  {
    icon: ShieldCheck,
    title: "Independent Compare Bazaar picks",
    body: "Vendor rankings follow editorial testing, placements here mirror Motive, Verizon Connect, Samsara, Fleetio, and peers from our guide.",
  },
  {
    icon: Zap,
    title: "Quotes within ~24 hours",
    body: "Single intake replaces repetitive vendor screening calls early in procurement.",
  },
  {
    icon: MessageCircle,
    title: "Guidance on modules",
    body: "Unclear if you need AI dashcam bundles vs maintenance-first stacks? Specialists clarify trade-offs.",
  },
];

type QuoteFormClientProps = { heading: string };

export default function GPSFleetGetQuotesForm({ heading }: QuoteFormClientProps) {
  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Technology", href: "/technology" },
          { label: "GPS Fleet Management", href: "/technology/gps-fleet-management-software" },
          { label: "Get Free Quotes" },
        ]}
      />

      <QuoteLandingHero
        eyebrow="Fleet telematics quotes"
        heading={heading}
        description="Capture fleet size and dominant vehicle types once. We route requests toward Motive, Teletrac Navman, Verizon Connect, Samsara, Surecam, Fleetio, and aligned alternatives from our 2026 GPS fleet guide."
        trustItems={[
          "Free quotes, no obligation",
          "Real-time GPS + safety stacks",
          "Editorially independent methodology",
          "~24 hour vendor alignment",
        ]}
        stats={[
          { n: "7+", l: "Platforms Compared" },
          { n: "ELD", l: "Compliance paths" },
          { n: "AI safety", l: "Dashcam leaders" },
          { n: "4.6★", l: "Top overall (Samsara)" },
        ]}
        vendors={VENDORS}
        vendorLabel="Featured fleet platforms on Compare Bazaar"
        formKey="gps-fleet"
      />

      <QuoteHowItWorksSection
        tag="How It Works"
        title="From fleet intake to vendor pilots"
        subtitle="Operational truth → aligned GPS proposals → hardware/software pilots only where ROI is clear."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Fleet Buyer Stories"
        title="Operations teams that de-risked telematics buys"
        subtitle="Mixed-duty fleets translating GPS quotes into measurable idle & safety gains."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Fleet-grade independence"
        subtitle="Hands-on telematics scoring informs who enters your quote pool, not sponsorship slots."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready for GPS fleet quotes?"
        subtitle="Scroll up, finish three quick steps, and compare aligned vendors."
      />
    </QuoteLandingPageShell>
  );
}
