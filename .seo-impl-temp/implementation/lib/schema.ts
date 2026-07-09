/**
 * lib/schema.ts — JSON-LD graph builders (server-side, one graph per page)
 * Render via <JsonLd graph={...} /> (components/JsonLd.tsx)
 */

const SITE = "https://www.compare-bazaar.com";

export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

/** Sitewide — include once in root layout */
export function organizationGraph() {
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Compare Bazaar",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: ["https://www.linkedin.com/company/comparebazaar/"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "539 W. Commerce St #2577",
        addressLocality: "Dallas",
        addressRegion: "TX",
        postalCode: "75208",
        addressCountry: "US",
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: "Compare Bazaar",
      publisher: { "@id": ORG_ID },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function breadcrumbGraph(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Comparison hub: ranked vendor list */
export function comparisonHubGraph(opts: {
  url: string;
  name: string;
  description: string;
  vendors: { name: string; url?: string; position: number }[];
}) {
  return {
    "@type": "ItemList",
    "@id": `${opts.url}#list`,
    name: opts.name,
    description: opts.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: opts.vendors.length,
    itemListElement: opts.vendors.map((v) => ({
      "@type": "ListItem",
      position: v.position,
      name: v.name,
      ...(v.url ? { url: v.url } : {}),
    })),
  };
}

/** FAQ — ONLY for questions visibly rendered on the page */
export function faqGraph(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Blog post */
export function blogPostingGraph(opts: {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string; // ISO 8601
  dateModified: string;  // ISO 8601 — must reflect REAL edits
  author: { name: string; url?: string };
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${opts.url}#article`,
    mainEntityOfPage: opts.url,
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: {
      "@type": "Person",
      name: opts.author.name,
      ...(opts.author.url ? { url: opts.author.url } : {}),
    },
    publisher: { "@id": ORG_ID },
  };
}

/** Whitepaper / research report */
export function reportGraph(opts: {
  url: string;
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@type": "Report",
    "@id": `${opts.url}#report`,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** Wrap page-level graphs into one @graph document */
export function buildGraph(...nodes: (object | object[])[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.flat(),
  };
}
