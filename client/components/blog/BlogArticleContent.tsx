'use client'

import type { ArticleContentChunk } from '@/lib/blogArticleEnrichments'
import { BlogArticleInsightChart } from '@/components/blog/enrichments/BlogArticleInsightChart'
import { BlogArticleStatGrid } from '@/components/blog/enrichments/BlogArticleStatGrid'
import { BlogArticleQuickCheck } from '@/components/blog/enrichments/BlogArticleQuickCheck'

type ArticleMeta = {
  slug: string
  topic?: string
  tags?: string[]
  title?: string
}

type Props = {
  chunks: ArticleContentChunk[]
  proseClassName: string
  articleMeta: ArticleMeta
}

function EnrichmentBlock({
  enrichment,
  articleMeta,
}: {
  enrichment: ArticleContentChunk & { kind: 'enrichment' }
  articleMeta: ArticleMeta
}) {
  const { enrichment: e } = enrichment
  if (e.type === 'chart') return <BlogArticleInsightChart enrichment={e} />
  if (e.type === 'stats') return <BlogArticleStatGrid enrichment={e} />
  return <BlogArticleQuickCheck enrichment={e} slug={articleMeta.slug} />
}

export function BlogArticleContent({ chunks, proseClassName, articleMeta }: Props) {
  return (
    <div className="blog-article-content-flow">
      {chunks.map((chunk, i) => {
        if (chunk.kind === 'html') {
          return (
            <div
              key={`html-${i}`}
              className={proseClassName}
              dangerouslySetInnerHTML={{ __html: chunk.html }}
            />
          )
        }
        return (
          <div key={chunk.enrichment.id} className="blog-article-enrichment-wrap">
            <EnrichmentBlock enrichment={chunk} articleMeta={articleMeta} />
          </div>
        )
      })}
    </div>
  )
}
