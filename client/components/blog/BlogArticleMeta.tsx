type Props = {
  category: string
  readTime: string
  publishedAt: Date
}

export function BlogArticleMeta({ category, readTime, publishedAt }: Props) {
  const publishedLabel = publishedAt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-md bg-[#0B2A6F] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
          {category}
        </span>
        <span className="text-[13px] font-medium text-slate-500">{readTime}</span>
      </div>
      <time className="text-[13px] text-slate-400" dateTime={publishedAt.toISOString()}>
        Updated {publishedLabel}
      </time>
    </div>
  )
}
