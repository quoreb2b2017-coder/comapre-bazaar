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
    { label: "Human Resources", href: "/human-resources" },
    { label: "Best Payroll Software", href: "/human-resources/best-payroll-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "Payroll quotes",
    description:
      "Share headcount, pay frequency, and preferred platforms once. Get aligned quotes from providers like ADP, OnPay, QuickBooks Payroll, and Gusto, free and no obligation.",
    trustItems: [
      "Free quotes, no credit card",
      "SMB through multi-state complexity",
      "Independent methodology",
      "Responses within ~24 hours",
    ],
    stats: [
      { n: "8+", l: "Platforms Compared" },
      { n: "24h", l: "Quote turnaround" },
      { n: "Tax filing", l: "Full-service options" },
      { n: "4.5★", l: "Top SMB pick (OnPay)" },
    ],
    vendors: [
      { name: "ADP", dot: "#D32F2F" },
      { name: "Zoho", dot: "#1A73E8" },
      { name: "BambooHR", dot: "#00A86B" },
      { name: "OnPay", dot: "#0066CC" },
      { name: "QuickBooks", dot: "#0077C5" },
      { name: "Gusto", dot: "#F45D48" },
    ],
    vendorLabel: "Platforms from our payroll comparison",
  },
  howItWorks: {
    tag: "How It Works",
    title: "Payroll shortlisting in three steps",
    subtitle: "One intake → matched vendors → you compare filing depth and pricing on your timeline.",
    steps: [
      {
        tag: "2 minutes",
        num: "01",
        title: "Describe payroll operations",
        body: "Headcount, frequency, incumbent tooling, and preferred vendors shape accurate proposals.",
      },
      {
        tag: "Within 24 hours",
        num: "02",
        title: "We align vendors",
        body: "Quotes emphasize compliance, contractor handling, and accounting integrations relevant to you.",
      },
      {
        tag: "Your pace",
        num: "03",
        title: "Choose or walk away",
        body: "Book demos only with payroll stacks that fit, no obligation.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Teams that clarified payroll options faster",
    subtitle: "Finance and HR leads comparing SMB payroll vs enterprise filing paths.",
    items: [
      {
        name: "Jordan Walsh",
        role: "Finance Manager",
        company: "Brightline Logistics",
        result: "Switched payroll vendors in one cycle",
        body: "We outlined frequency and contractor mix once. The quotes lined up with our compliance needs instead of generic outbound pitches.",
        initials: "JW",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Priya Nanduri",
        role: "Founder",
        company: "Cypress Labs",
        result: "OnPay shortlisted alongside QuickBooks options",
        body: "As a QuickBooks shop we wanted apples-to-apples pricing. The process surfaced full-service filing choices without weeks of discovery calls.",
        initials: "PN",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Chris Meyer",
        role: "HR Ops Lead",
        company: "Union Crafts Co.",
        result: "Multi-state payroll quotes same week",
        body: "ADP-level complexity vs SMB tools was confusing until we compared structured proposals side-by-side.",
        initials: "CM",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Buyer-first payroll matching",
    subtitle: "Independent rankings plus structured quote routing, not pay-to-rank placements.",
    items: [
      {
        title: "Matched to headcount & frequency",
        body: "We route SMB and growing teams to payroll stacks that fit run cadence, contractor mix, and compliance depth.",
      },
      {
        title: "Editorially independent",
        body: "Rankings follow Compare Bazaar methodology, vendors cannot buy placement in your matched quotes.",
      },
      {
        title: "Fast turnaround",
        body: "Submit once and compare tailored payroll proposals within about one business day.",
      },
      {
        title: "Specialist context",
        body: "Unsure between full-service filing vs software-led workflows? We help interpret trade-offs at no cost.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to compare payroll platforms?",
    subtitle: "Jump back to the form, quotes tailored to your headcount and pay cycle.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function PayrollGetQuotesForm({ heading, landingContent }: QuoteFormClientProps) {
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
        formKey="payroll"
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
