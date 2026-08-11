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
    { label: "Best CRM Software", href: "/marketing/best-crm-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "CRM Quote Comparison",
    description:
      "Describe your requirements once. Within 24 hours, we'll match you with 3–5 CRM vendors whose features, pricing, and industry experience genuinely suit your team, completely free, no obligation.",
    trustItems: [
      "Free quotes, no credit card needed",
      "Matched results within 24 hours",
      "50+ vetted CRM vendors in our network",
      "Independent recommendations, no pay-to-rank",
    ],
    stats: [
      { n: "2,400+", l: "Businesses Matched" },
      { n: "24h", l: "Avg. Quote Delivery" },
      { n: "50+", l: "CRM Vendors" },
      { n: "4.8 / 5", l: "Avg. User Rating" },
    ],
    vendors: [
      { name: "Salesforce", dot: "#00A1E0" },
      { name: "HubSpot", dot: "#FF7A59" },
      { name: "Zoho CRM", dot: "#E62129" },
      { name: "Pipedrive", dot: "#1F5C99" },
      { name: "Creatio", dot: "#FB8C00" },
      { name: "HoneyBook", dot: "#7E57C2" },
    ],
    vendorLabel: "Quotes sourced from leading CRM providers",
  },
  howItWorks: {
    tag: "How It Works",
    title: "From your first click to a signed contract in three steps",
    subtitle: "No repeated intake forms. No unsolicited sales calls. Submit once and we'll handle the rest.",
    steps: [
      {
        tag: "2 minutes",
        num: "01",
        title: "Describe Your Requirements",
        body: "Our three-step form captures your team size, industry, must-have features, and buying timeline. No irrelevant questions, no long-winded surveys.",
      },
      {
        tag: "Within 24 hours",
        num: "02",
        title: "We Match and Notify You",
        body: "Our specialists review your profile and match it to the vendors in our network who are the strongest fit. You receive 3–5 tailored quotes by email.",
      },
      {
        tag: "On your schedule",
        num: "03",
        title: "Compare, Choose, or Walk Away",
        body: "Review the quotes side-by-side. Request demos only from vendors you like. There is no obligation and no pressure to decide quickly.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Results from businesses that used Compare Bazaar",
    subtitle: "Over 2,400 organisations have found their CRM through our matching process. Here are three of their experiences.",
    items: [
      {
        name: "Priya Mehta",
        role: "VP of Sales",
        company: "NovaTech Solutions",
        result: "Reduced CRM spend by $1,100/month",
        body: "We had spent weeks evaluating tools on our own and were going in circles. The matching process here was fast and relevant; we signed with Pipedrive within a week of receiving our quotes.",
        initials: "PM",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "James Okafor",
        role: "CEO",
        company: "BrightLeaf Retail",
        result: "Pipeline visibility up 35% in 60 days",
        body: "I was sceptical because these quote forms usually generate spam. Instead, I received four properly tailored vendor quotes within 24 hours. The side-by-side comparison made the final decision straightforward.",
        initials: "JO",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Sana Rashid",
        role: "Operations Director",
        company: "MedCore Health",
        result: "Onboarded 120 users across 3 departments",
        body: "Healthcare CRM needs are niche. I had specific compliance and integration requirements. The form captured them accurately and every vendor who responded was actually relevant to our use case.",
        initials: "SR",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Built to serve buyers, not vendors",
    subtitle: "Our editorial rankings are independent. Our matching process is based on fit. We only benefit when you find something that works for your business.",
    items: [
      {
        title: "Matched, not just listed",
        body: "We compare your profile against 50+ CRM vendors and filter down to the 3–5 that genuinely suit your team size, industry, and budget, not whoever paid to appear first.",
      },
      {
        title: "Editorially independent",
        body: "Every vendor ranking is built on hands-on expert testing and a published scoring methodology. No CRM provider can buy a better position.",
      },
      {
        title: "Quotes within 24 hours",
        body: "Submit once. Our specialists do the legwork. Expect 3–5 personalised quotes in your inbox the same business day, with no sales calls needed upfront.",
      },
      {
        title: "Free specialist support",
        body: "Unsure which features matter for your use case? Our CRM specialists will walk through the options with you at no cost and with no obligation to proceed.",
      },
    ],
  },
  bottomCta: {
    title: "Ready to find the right CRM for your business?",
    subtitle: "Join 2,400+ businesses. Free matched quotes delivered within 24 hours.",
  },
};

const WHY_ICONS: LucideIcon[] = [Target, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function CRMQuotePage({ heading, landingContent }: QuoteFormClientProps) {
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
