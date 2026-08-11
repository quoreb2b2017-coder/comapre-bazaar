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
    { label: "Sales", href: "/sales" },
    { label: "Best CRM Software", href: "/sales/best-crm-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "Sales CRM quotes",
    description:
      "Share headcount, current CRM stance, and must-have capability chips once. Quotes align with the same vendors we review for sales teams, Zoho CRM, HubSpot Sales Hub, Pipedrive, Creatio, Salesforce, HoneyBook, and peers.",
    trustItems: [
      "Free quotes, no obligation",
      "Pipeline-first vendor routing",
      "Independent rankings",
      "Fast turnaround",
    ],
    stats: [
      { n: "9+", l: "CRMs Compared" },
      { n: "24h", l: "Avg. routing" },
      { n: "Forecasting", l: "SMB → enterprise" },
      { n: "4.5★", l: "Pipeline pick (Pipedrive)" },
    ],
    vendors: [
      { name: "Zoho CRM", dot: "#E62129" },
      { name: "Creatio", dot: "#FB8C00" },
      { name: "HubSpot", dot: "#FF7A59" },
      { name: "HoneyBook", dot: "#7E57C2" },
      { name: "Pipedrive", dot: "#1F5C99" },
      { name: "Salesforce", dot: "#00A1E0" },
    ],
    vendorLabel: "Platforms from our sales CRM comparison",
  },
  howItWorks: {
    tag: "How It Works",
    title: "Sales CRM shortlist in three steps",
    subtitle: "Context → matched vendors → compare quotes without endless discovery calls.",
    steps: [
      {
        tag: "2 min",
        num: "01",
        title: "Capture team + stack",
        body: "Headcount, CRM posture, and industry anchor fit-based routing.",
      },
      {
        tag: "24h",
        num: "02",
        title: "Align vendors",
        body: "Responses reference tools from our comparison, Pipedrive, HubSpot, Zoho, Salesforce, etc.",
      },
      {
        tag: "You choose",
        num: "03",
        title: "Compare & pilot",
        body: "Review proposals in parallel; engage only winners you shortlist.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Rev teams that moved faster",
    subtitle: "Pipeline-led orgs comparing forecasting depth vs speed-to-value CRMs.",
    items: [
      {
        name: "Jordan Blake",
        role: "Sales Director",
        company: "Nimbus SaaS",
        result: "Pipedrive + HubSpot shortlisted same week",
        body: "We stated pipeline maturity and integrations once. Responses referenced the same stacks we saw on Compare Bazaar, fewer junk vendors.",
        initials: "JB",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Anita Deshmukh",
        role: "RevOps Lead",
        company: "Vertex Industrial",
        result: "Cut evaluation cycle ~40%",
        body: "Enterprise Salesforce vs nimble SMB tools was polarizing until quotes framed admin cost honestly.",
        initials: "AD",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Marcus Lowell",
        role: "Founder",
        company: "Coastline Creatives",
        result: "HoneyBook-aligned proposal for creative ops",
        body: "Proposal-to-pay workflows mattered, matched vendors respected that nuance versus generic CRM blasts.",
        initials: "ML",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Buyer-first sales tech",
    subtitle: "Editorial testing, not pay-to-rank vendor blasts.",
    items: [
      {
        title: "Sales-motion aware",
        body: "Headcount and CRM familiarity route quotes toward pipeline-heavy, lifecycle, or service-sales stacks.",
      },
      {
        title: "Editorial roster",
        body: "Pills mirror our sales CRM methodology, Zoho, Creatio, HubSpot, Pipedrive, Salesforce, HoneyBook.",
      },
      {
        title: "~24 hour alignment",
        body: "One structured intake replaces slow cold outreach loops early in procurement.",
      },
      {
        title: "Specialist framing",
        body: "Unclear forecasting vs sequencing needs? Quotes emphasize the right CRM depth.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to compare sales CRMs?",
    subtitle: "Jump to the form, three steps to aligned vendor quotes.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function SalesCRMGetQuotesPage({ heading, landingContent }: QuoteFormClientProps) {
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
        formKey="crm"
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
