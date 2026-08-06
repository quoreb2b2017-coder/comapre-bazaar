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
  { tag: "2 minutes", num: "01", title: "Outline workforce priorities", body: "Headcount plus attendance, performance, onboarding, or all-in-one needs anchor aligned demos." },
  { tag: "Within 24 hours", num: "02", title: "We route HR-fit vendors", body: "Shortlists reflect Compare Bazaar editorial picks, Teramind, ActivTrak, Hubstaff, BambooHR, and peers." },
  { tag: "Your pace", num: "03", title: "Compare & proceed", body: "Review proposals side-by-side; engage vendors only when it makes sense." },
];

const VENDORS = [
  { name: "Teramind", dot: "#0052CC" },
  { name: "ActivTrak", dot: "#6366F1" },
  { name: "Hubstaff", dot: "#276EE7" },
  { name: "BambooHR", dot: "#00A86B" },
  { name: "Intelogos", dot: "#7C3AED" },
  { name: "Rippling", dot: "#4F46E5" },
];

const TESTIMONIALS = [
  {
    name: "Sonia Patel",
    role: "People Ops",
    company: "Relay Analytics",
    result: "Shortlisted BambooHR vs Rippling in days",
    body: "We stated headcount and workflow gaps once. Matched vendors actually reflected onboarding and performance priorities.",
    initials: "SP",
    avatarBg: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    name: "Ethan Cole",
    role: "COO",
    company: "Northwind Field Svcs.",
    result: "Remote visibility without surveillance creep",
    body: "Hybrid scheduling plus attendance clarity mattered. Quotes differentiated analytics-heavy tools from full HRIS paths.",
    initials: "EC",
    avatarBg: "#DCFCE7",
    avatarText: "#16A34A",
  },
  {
    name: "Maria Santos",
    role: "HR Director",
    company: "Evergreen Clinics",
    result: "Compliance-forward workflows surfaced faster",
    body: "Policy-heavy onboarding needed structured demos, not generic HR suites. The routing reflected that.",
    initials: "MS",
    avatarBg: "#FEF3C7",
    avatarText: "#D97706",
  },
];

const WHY_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Matched to HR maturity",
    body: "Headcount + stated management needs route you toward HRIS, analytics, or monitoring-fit stacks, not one generic list.",
  },
  {
    icon: ShieldCheck,
    title: "Independent rankings",
    body: "Our employee-management methodology is editorial, placements in quotes are fit-based, not sponsored slots.",
  },
  {
    icon: Zap,
    title: "Fast comparisons",
    body: "Submit once and receive tailored vendor responses you can compare side-by-side.",
  },
  {
    icon: MessageCircle,
    title: "Guidance when unclear",
    body: "Not sure between workforce analytics vs core HRIS? Specialists help interpret options at no cost.",
  },
];

type QuoteFormClientProps = { heading: string };

export default function EmployeeManagementGetQuotesForm({ heading }: QuoteFormClientProps) {
  return (
    <QuoteLandingPageShell>
      <QuoteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Human Resources", href: "/human-resources" },
          { label: "Best Employee Management Software", href: "/human-resources/best-employee-management-software" },
          { label: "Get Free Quotes" },
        ]}
      />

      <QuoteLandingHero
        eyebrow="HR & workforce quotes"
        heading={heading}
        description="Outline headcount and priorities, time tracking, performance cycles, onboarding, or all-in-one HR. Get matched quotes referencing the same platforms we review: Teramind, ActivTrak, Hubstaff, BambooHR, Intelogos, Rippling, and more."
        trustItems={[
          "Free quotes, no obligation",
          "SMB through scaling teams",
          "Independent Compare Bazaar methodology",
          "Fast vendor alignment",
        ]}
        stats={[
          { n: "8+", l: "Platforms Evaluated" },
          { n: "24h", l: "Typical response" },
          { n: "HRIS + analytics", l: "Coverage mix" },
          { n: "4.5★", l: "BambooHR SMB pick" },
        ]}
        vendors={VENDORS}
        vendorLabel="Platforms from our employee-management comparison"
        formKey="employee-management"
      />

      <QuoteHowItWorksSection
        tag="How It Works"
        title="Three steps to a clearer HR shortlist"
        subtitle="Structured intake → matched vendors → you compare onboarding depth and analytics fit on your timeline."
        steps={HOW_STEPS}
      />

      <QuoteTestimonialsSection
        tag="Buyer Stories"
        title="Teams that accelerated HR evaluations"
        subtitle="People leaders comparing workforce analytics vs HRIS-first stacks."
        testimonials={TESTIMONIALS}
      />

      <QuoteWhyCompareSection
        tag="Why Compare Bazaar"
        title="Buyer-centric workforce matching"
        subtitle="Editorial testing plus transparent routing, not pay-for-placement quote spam."
        items={WHY_ITEMS}
      />

      <QuoteBottomCta
        title="Ready to compare employee management platforms?"
        subtitle="Tell us headcount and priorities once, get structured vendor quotes back quickly."
      />
    </QuoteLandingPageShell>
  );
}
