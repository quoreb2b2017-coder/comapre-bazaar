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
    { label: "Marketing", href: "/marketing" },
    { label: "Best Email Marketing Services", href: "/marketing/best-email-marketing-services" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "Email marketing quotes",
    description:
      "Share list size, sending cadence, and automation needs once. Within 24 hours we match you with platforms that fit deliverability, templates, and pricing, free and no obligation.",
    trustItems: [
      "Free quotes, no credit card",
      "Matched options within 24 hours",
      "30+ ESPs & suites in our network",
      "Independent recommendations",
    ],
    stats: [
      { n: "2,500+", l: "Businesses Matched" },
      { n: "24h", l: "Avg. Quote Delivery" },
      { n: "30+", l: "ESP Vendors" },
      { n: "4.9 / 5", l: "Avg. User Rating" },
    ],
    vendors: [
      { name: "Mailchimp", dot: "#FFE01B" },
      { name: "Klaviyo", dot: "#242429" },
      { name: "ActiveCampaign", dot: "#356AE6" },
      { name: "Constant Contact", dot: "#1856BF" },
      { name: "Brevo", dot: "#0B996E" },
      { name: "HubSpot", dot: "#FF7A59" },
    ],
    vendorLabel: "Quotes sourced from leading email platforms",
  },
  howItWorks: {
    tag: "How It Works",
    title: "From form to shortlist in three quick steps",
    subtitle:
      "One structured intake. No repeated questionnaires. We route your answers to ESPs that fit your sending profile.",
    steps: [
      {
        tag: "2 minutes",
        num: "01",
        title: "Describe your email program",
        body: "Share contact details, list size, monthly sends, and industries so vendors understand scale and compliance context.",
      },
      {
        tag: "Within 24 hours",
        num: "02",
        title: "We match and notify you",
        body: "Specialists map your requirements to platforms with the right automation, templates, and integrations.",
      },
      {
        tag: "Your pace",
        num: "03",
        title: "Compare quotes & demos",
        body: "Review side-by-side pricing and features. Book demos only with vendors you want to explore.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Teams that found the right ESP through Compare Bazaar",
    subtitle: "Real outcomes from marketing leaders who wanted clearer quotes without endless vendor spam.",
    items: [
      {
        name: "Elena Voss",
        role: "Marketing Director",
        company: "Northwind Goods",
        result: "Cut ESP spend 28% after comparing quotes",
        body: "We outlined list size and automation needs once. Within a day we had four platforms that actually matched deliverability requirements, not random cold outreach.",
        initials: "EV",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Marcus Chen",
        role: "Founder",
        company: "Pulse SaaS",
        result: "Live on Klaviyo in under three weeks",
        body: "I expected spam. Instead the quotes were structured and comparable. The shortlist matched our ecommerce stack and compliance questions.",
        initials: "MC",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Danielle Brooks",
        role: "CRM & Lifecycle Lead",
        company: "UrbanFit Co.",
        result: "Found an ESP that scales past 50k contacts",
        body: "Subscriber growth made pricing unpredictable. The matched vendors understood segmentation and campaign frequency, saved hours of demo scheduling.",
        initials: "DB",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Built for buyers evaluating ESPs",
    subtitle: "Independent methodology, transparent matching, and specialists who understand lifecycle marketing.",
    items: [
      {
        title: "Matched to list size & cadence",
        body: "We route your profile against platforms that fit subscriber counts, sending volume, and automation depth, not generic bulk lists.",
      },
      {
        title: "Editorially independent",
        body: "Rankings follow our published methodology. Providers cannot pay for placement in your quote results.",
      },
      {
        title: "Quotes within 24 hours",
        body: "Submit once. Expect several tailored ESP options in your inbox the same business day, with no obligation.",
      },
      {
        title: "Specialist support",
        body: "Unsure about deliverability or integrations? Our team helps interpret quotes at no cost.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to compare email marketing platforms?",
    subtitle: "Join thousands of teams. Free matched quotes within 24 hours.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function EmailMarketingQuotePage({ heading, landingContent }: QuoteFormClientProps) {
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
        formKey="email-marketing"
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
