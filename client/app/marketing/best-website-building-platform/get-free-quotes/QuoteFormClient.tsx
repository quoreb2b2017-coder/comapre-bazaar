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
  { tag: "2 minutes", num: "01", title: "Outline your build", body: "Tell us about pages, storefront needs, and team size so proposals reflect real workload." },
  { tag: "Within 24 hours", num: "02", title: "Receive tailored quotes", body: "Matched vendors respond with pricing ranges, onboarding timelines, and feature highlights." },
  { tag: "You decide", num: "03", title: "Pick your builder", body: "Compare side-by-side. Proceed only with platforms that meet design and growth goals." },
];

const VENDORS = [
  { name: "Wix", dot: "#0C6EFC" },
  { name: "Squarespace", dot: "#111827" },
  { name: "Webflow", dot: "#4353FF" },
  { name: "Shopify", dot: "#95BF47" },
  { name: "WordPress", dot: "#21759B" },
  { name: "GoDaddy", dot: "#00A4A6" },
];

const TESTIMONIALS = [
  {
    name: "Rachel Kim",
    role: "Creative Director",
    company: "Harbor Studio",
    result: "Launched portfolio site in 10 days",
    body: "We described pages, branding needs, and SEO must-haves once. The quotes pointed us to builders that actually supported our template workflow.",
    initials: "RK",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Tom Alvarez",
    role: "Owner",
    company: "Alvarez Electric",
    result: "Booked 40% more calls after rebuild",
    body: "I needed mobile speed and local SEO without hiring an agency. Matched platforms gave clear pricing, chose one and shipped fast.",
    initials: "TA",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Amelia Frost",
    role: "E-commerce Lead",
    company: "Lumen Goods",
    result: "Found a builder that scales checkout",
    body: "Cart requirements were specific. Every quoted vendor understood inventory sync, avoided weeks of irrelevant demos.",
    initials: "AF",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched to site scope",
    body: "We factor website type, page counts, and commerce needs so you hear from builders that fit, not one-size templates.",
  },
  {
    icon: ShieldCheck,
    title: "Editorially independent",
    body: "Our rankings follow hands-on testing. Providers cannot buy better placement in your quote matches.",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    body: "Submit once and receive comparable quotes quickly, compare features and onboarding timelines side-by-side.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when you need it",
    body: "Unclear about SEO or storefront apps? Specialists help interpret proposals at no cost.",
  },
];

type QuoteFormClientProps = { heading: string };

export default function WebsiteBuildingQuotePage({ heading }: QuoteFormClientProps) {
  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Marketing", href: "/marketing" },
          { label: "Best Website Building Platform", href: "/marketing/best-website-building-platform" },
          { label: "Get Free Quotes" },
        ]}
      />

      <QuoteLandingHero
        eyebrow="Website builder quotes"
        heading={heading}
        description="Outline site type, page scope, and e‑commerce needs once. Within 24 hours we match you with platforms that fit templates, SEO, and budget, free and no obligation."
        trustItems={[
          "Free quotes, no credit card",
          "Matched builders within 24 hours",
          "Broad coverage of leading platforms",
          "Independent recommendations",
        ]}
        stats={[
          { n: "3,100+", l: "Sites Planned" },
          { n: "24h", l: "Avg. Quote Delivery" },
          { n: "25+", l: "Builder Brands" },
          { n: "4.8 / 5", l: "Avg. User Rating" },
        ]}
        vendors={VENDORS}
        vendorLabel="Quotes sourced from popular builders"
        formKey="website-building"
      />

      <QuoteHowItWorksSection
        tag="How It Works"
        title="Launch-ready comparisons without agency overhead"
        subtitle="Capture scope once. We route builders that align with templates, commerce, and SEO expectations."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that shipped faster with clearer builder quotes"
        subtitle="Owners and marketers who wanted credible comparisons, not endless cold outreach."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Guidance for teams picking a website platform"
        subtitle="Independent reviews, structured matching, and transparent next steps, built for operators and creatives alike."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready to pick your website builder?"
        subtitle="Share scope once, receive comparable quotes within a day."
      />
    </QuoteLandingPageShell>
  );
}
