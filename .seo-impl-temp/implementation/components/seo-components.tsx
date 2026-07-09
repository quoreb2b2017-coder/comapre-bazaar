/**
 * components/seo-components.tsx
 * Split into separate files in your repo if preferred; grouped here for review.
 */
import Link from "next/link";
import type { Metadata } from "next";
import {
  postsForHub,
  siblingPosts,
  primaryHubForPost,
  hubBySlug,
  pillarBySlug,
} from "@/lib/content-map";

const SITE = "https://www.compare-bazaar.com";

// ── 1. JSON-LD renderer (server component) ─────────────────────────────────
export function JsonLd({ graph }: { graph: object }) {
  return (
    <script
      type="application/ld+json"
      // Server-rendered structured data; content is code-controlled, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

// ── 2. Breadcrumbs (pair with breadcrumbGraph from lib/schema.ts) ─────────
export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: "flex", gap: 8, listStyle: "none", padding: 0 }}>
        {items.map((item, i) => (
          <li key={item.url}>
            {i < items.length - 1 ? (
              <>
                <Link href={item.url}>{item.name}</Link>
                <span aria-hidden> › </span>
              </>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── 3a. Hub page: "Further reading" (auto-derived spokes) ──────────────────
export function HubRelatedContent({ hubSlug }: { hubSlug: string }) {
  const related = postsForHub(hubSlug);
  const hub = hubBySlug[hubSlug];
  if (!related.length) return null;
  return (
    <aside aria-labelledby="further-reading">
      <h2 id="further-reading">Further reading on {hub.name}</h2>
      <ul>
        {related.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── 3b. Blog post: primary hub CTA + sibling guides ───────────────────────
export function PostRelatedContent({ postSlug }: { postSlug: string }) {
  const hub = primaryHubForPost(postSlug);
  const siblings = siblingPosts(postSlug);
  return (
    <aside aria-labelledby="related-guides">
      {hub && (
        <p>
          {/* Primary internal link: descriptive, keyword-bearing anchor */}
          Ready to shortlist?{" "}
          <Link href={hub.path}>
            Compare the {hub.name.toLowerCase()} we&apos;ve tested and priced
          </Link>
          .
        </p>
      )}
      {siblings.length > 0 && (
        <>
          <h2 id="related-guides">Related guides</h2>
          <ul>
            {siblings.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

// ── 4. Verification stamp — one source of truth for E-E-A-T + dateModified ─
export function VerificationStamp({ lastVerified }: { lastVerified: string }) {
  const d = new Date(lastVerified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <p>
      <strong>Pricing &amp; facts verified:</strong> {d} ·{" "}
      <Link href="/editorial-process">How we review</Link>
    </p>
  );
}

// ── 5. Metadata factory — consistent titles/canonicals/OG on every template ─
const YEAR = new Date().getFullYear(); // build-time year token

export function hubMetadata(hubSlug: string): Metadata {
  const hub = hubBySlug[hubSlug];
  const url = `${SITE}${hub.path}`;
  const title = `Best ${hub.name} ${YEAR}: Tools Compared & Priced`;
  const description = `Independent ${hub.name.toLowerCase()} comparison for US SMBs — verified pricing, hands-on scoring across 12+ criteria, no pay-to-play rankings.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "Compare Bazaar" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function postMetadata(opts: {
  slug: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = `${SITE}/blog/${opts.slug}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: "article",
      siteName: "Compare Bazaar",
      ...(opts.image ? { images: [opts.image] } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}
