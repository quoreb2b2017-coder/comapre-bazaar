import { ImageIcon } from 'lucide-react'
import { BlogCoverPicker } from './BlogCoverPicker'

/**
 * Cover image panel for blog admin — upload your own photo or fetch from Unsplash.
 */
export function BlogCoverPanel({ blogId, coverImageUrl, topic, title, tags, keywords, onUpdated, toast, className = '' }) {
  return (
    <div className={`card overflow-hidden ${className}`.trim()}>
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Cover image</h3>
        <p className="mt-0.5 text-[11px] text-gray-400">Upload a photo or pick one from Unsplash</p>
      </div>
      <div className="p-4">
        <BlogCoverPicker
          blogId={blogId}
          coverImageUrl={coverImageUrl}
          topic={topic}
          title={title}
          tags={tags}
          keywords={keywords}
          toast={toast}
          onChange={({ coverImageUrl: nextUrl }) => onUpdated?.(nextUrl)}
        />
      </div>
    </div>
  )
}

/** Small thumbnail for tables / dashboard lists */
export function BlogCoverThumb({ coverImageUrl, title, className = 'h-11 w-16' }) {
  const url = coverImageUrl?.trim()
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`.trim()}
      title={title}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
          <ImageIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}
