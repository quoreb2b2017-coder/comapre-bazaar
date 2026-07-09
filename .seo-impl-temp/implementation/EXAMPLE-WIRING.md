# Example wiring — how the pieces fit on real pages

## A. Comparison hub: `app/human-resources/best-payroll-software/page.tsx`

```tsx
import { buildGraph, breadcrumbGraph, comparisonHubGraph, faqGraph } from "@/lib/schema";
import { JsonLd, Breadcrumbs, HubRelatedContent, VerificationStamp, hubMetadata } from "@/components/seo-components";
import { hubBySlug, pillarBySlug } from "@/lib/content-map";

const hub = hubBySlug["payroll"];
const pillar = pillarBySlug[hub.pillar];
const SITE = "https://www.compare-bazaar.com";

export const metadata = hubMetadata("payroll");

const crumbs = [
  { name: "Home", url: `${SITE}/` },
  { name: pillar.name, url: `${SITE}${pillar.path}` },
  { name: hub.name, url: `${SITE}${hub.path}` },
];

// Your existing vendor data — content unchanged, just fed into schema
const vendors = [
  { name: "Gusto", position: 1 },
  { name: "ADP Run", position: 2 },
  { name: "Paychex Flex", position: 3 },
  // ...all 8
];

const faqs = [
  { q: "How much does payroll software cost for a small business?", a: "…the answer text exactly as shown on the page…" },
  // only FAQs actually rendered below
];

export default function Page() {
  const graph = buildGraph(
    breadcrumbGraph(crumbs),
    comparisonHubGraph({
      url: `${SITE}${hub.path}`,
      name: `Best Payroll Software ${new Date().getFullYear()}`,
      description: "Independent payroll software comparison with verified pricing.",
      vendors,
    }),
    faqGraph(faqs),
  );

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs items={crumbs} />
      <VerificationStamp lastVerified="2026-07-01" />

      {/* …your existing comparison content, untouched… */}

      <HubRelatedContent hubSlug="payroll" />  {/* auto-links the 2 payroll posts */}
    </>
  );
}
```

## B. Blog post: `app/blog/[slug]/page.tsx` (relevant additions)

```tsx
import { buildGraph, breadcrumbGraph, blogPostingGraph } from "@/lib/schema";
import { JsonLd, Breadcrumbs, PostRelatedContent, VerificationStamp, postMetadata } from "@/components/seo-components";

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug); // your existing data source
  return postMetadata({ slug: post.slug, title: post.title, description: post.excerpt, image: post.image });
}

export default async function Page({ params }) {
  const post = await getPost(params.slug);
  const SITE = "https://www.compare-bazaar.com";
  const url = `${SITE}/blog/${post.slug}`;

  const crumbs = [
    { name: "Home", url: `${SITE}/` },
    { name: "Blog", url: `${SITE}/blog` },
    { name: post.title, url },
  ];

  const graph = buildGraph(
    breadcrumbGraph(crumbs),
    blogPostingGraph({
      url,
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.publishedAt,
      dateModified: post.lastVerified, // same field as the on-page stamp
      author: { name: post.author.name, url: `${SITE}/authors/${post.author.slug}` },
    }),
  );

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs items={crumbs} />
      <VerificationStamp lastVerified={post.lastVerified} />

      {/* …existing article body, untouched… */}

      <PostRelatedContent postSlug={post.slug} />
      {/* Renders: primary CTA link into /human-resources/best-payroll-software
          + sibling payroll guides. The hub↔spoke loop is now closed both ways. */}
    </>
  );
}
```

## C. Root layout: sitewide Organization + WebSite schema

```tsx
import { buildGraph, organizationGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo-components";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd graph={buildGraph(organizationGraph())} />
        {children}
      </body>
    </html>
  );
}
```

## D. Build-time content-gap check (optional CI step)

```ts
// scripts/coverage-check.ts
import { coverageGaps } from "@/lib/content-map";
const gaps = coverageGaps(3);
if (gaps.length) {
  console.warn("Hubs with <3 supporting posts:", gaps);
  // Currently: email-marketing, website-builders, call-center,
  // project-management, hr (0 posts each) — your content calendar.
}
```
