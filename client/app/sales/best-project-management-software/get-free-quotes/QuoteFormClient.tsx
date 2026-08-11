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
import { KanbanSquare, MessageCircle, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

const PAGE_DEFAULTS: QuoteLandingContent = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Sales", href: "/sales" },
    { label: "Best Project Management Software", href: "/sales/best-project-management-software" },
    { label: "Get Free Quotes" },
  ],
  hero: {
    eyebrow: "PM software quotes",
    description:
      "Tell us team size, work style, timeline, and must-have automation once, then receive vendor matches anchored to Monday.com, ClickUp, Asana, Notion, Jira, and the platforms in our comparison guide.",
    trustItems: [
      "Free quotes · no obligation",
      "SMB through scaling programs",
      "Independent methodology",
      "Fast turnaround",
    ],
    stats: [
      { n: "9+", l: "PM apps tested" },
      { n: "Gantt+", l: "Multi-view stacks" },
      { n: "Auto", l: "Rules-heavy paths" },
      { n: "4.5★", l: "Flexible pick (Monday)" },
    ],
    vendors: [
      { name: "Monday.com", dot: "#FF3D57" },
      { name: "ClickUp", dot: "#7B68EE" },
      { name: "Asana", dot: "#F06A6A" },
      { name: "Notion", dot: "#111827" },
      { name: "Jira", dot: "#0052CC" },
      { name: "Trello", dot: "#0079BF" },
    ],
    vendorLabel: "Top platforms from Compare Bazaar reviews",
  },
  howItWorks: {
    tag: "How It Works",
    title: "Project tooling without spreadsheet chaos",
    subtitle: "Facts → credible shortlists → trials with vendors that mirror your workloads.",
    steps: [
      {
        tag: "Fast",
        num: "01",
        title: "Quantify teamwork",
        body: "Sizing, workflows, timelines, budgets, distilled once for vendor alignment.",
      },
      {
        tag: "Matched",
        num: "02",
        title: "PM vendors respond",
        body: "Proposals cite stacks from Compare Bazaar testing, Monday, ClickUp, Asana, Jira, etc.",
      },
      {
        tag: "Decide",
        num: "03",
        title: "Pilot with confidence",
        body: "Skip shelfware demos; negotiate with finalists that fit automation + visibility needs.",
      },
    ],
  },
  testimonials: {
    tag: "Buyer Stories",
    title: "Teams shipping PM decisions faster",
    subtitle: "Ops & eng leaders balancing Gantt fidelity with doc-light collaboration.",
    items: [
      {
        name: "Sophie Brennan",
        role: "PMO Lead",
        company: "Helio Renewables",
        result: "Monday vs ClickUp decision in two sprints",
        body: "Automation + workload truth captured once, demos stopped rehashing basic Kanban fluff.",
        initials: "SB",
        avatarBg: "#DBEAFE",
        avatarText: "#1D4ED8",
      },
      {
        name: "Ravi Kapoor",
        role: "Engineering Manager",
        company: "Tidal Payments",
        result: "Jira stack validated against hybrid ClickUp pilots",
        body: "Quotes respected agile reporting depth instead of forcing generic PM fluff on dev teams.",
        initials: "RK",
        avatarBg: "#DCFCE7",
        avatarText: "#16A34A",
      },
      {
        name: "Maya Owens",
        role: "Marketing Ops",
        company: "Northwind Content",
        result: "Notion + Asana hybrids priced fairly",
        body: "Cross-functional approvals needed transparency, responders mapped doc + task workflows clearly.",
        initials: "MO",
        avatarBg: "#FEF3C7",
        avatarText: "#D97706",
      },
    ],
  },
  whyCompare: {
    tag: "Why Compare Bazaar",
    title: "Editorially grounded PM picks",
    subtitle: "Hands-on scoring keeps vendor routing honest.",
    items: [
      {
        title: "Workflow-aware routing",
        body: "Team size, workload views, automation appetite, and doc habits steer PM stack recommendations.",
      },
      {
        title: "Same roster we publish",
        body: "Monday.com, ClickUp, Asana, Notion, Jira, Smartsheet, Trello anchor buyer expectations.",
      },
      {
        title: "Fast benchmarking",
        body: "One intake beats vendor-by-vendor datasheet scavenger hunts.",
      },
      {
        title: "Clarity before trials",
        body: "Gantt, automation tiers, integrations, surfaced before you sink weeks into POCs.",
      },
    ],
  },
  bottomCta: {
    title: "Need PM vendor quotes?",
    subtitle: "Jump up and finish three quick steps, we mirror the stacks we benchmark.",
  },
};

const WHY_ICONS: LucideIcon[] = [KanbanSquare, ShieldCheck, Zap, MessageCircle];

type QuoteFormClientProps = { heading: string; landingContent?: QuoteLandingContent | null };

export default function ProjectManagementGetQuotesPage({ heading, landingContent }: QuoteFormClientProps) {
  const content = mergeQuoteLandingContent(PAGE_DEFAULTS, landingContent);
  const whyItems = (content.whyCompare?.items || []).map((item, index) => ({
    icon: WHY_ICONS[index] || KanbanSquare,
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
        formKey="project-management"
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
