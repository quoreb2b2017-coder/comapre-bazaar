import { useState, useEffect } from 'react'
import { ImageIcon, Loader2, RefreshCw } from 'lucide-react'
import api from '../../utils/api'

/**
 * Cover image panel for blog admin — preview + Unsplash-only regenerate (no content change).
 */
export function BlogCoverPanel({ blogId, coverImageUrl, onUpdated, toast, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState(coverImageUrl || '')

  useEffect(() => {
    setUrl(coverImageUrl || '')
  }, [coverImageUrl])

  const displayUrl = url?.trim() || ''

  const handleRegenerateCover = async () => {
    if (!blogId || loading) return
    setLoading(true)
    try {
      const res = await api.post(`/blogs/${blogId}/regenerate-cover`, {}, { timeout: 30000 })
      const newUrl = res.coverImageUrl || res.data?.coverImageUrl || ''
      if (newUrl) {
        setUrl(newUrl)
        onUpdated?.(newUrl, res.data)
        toast.success(res.message || 'Cover image updated from Unsplash')
      } else {
        toast.error('No cover image returned from Unsplash')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to regenerate cover')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card overflow-hidden ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Cover image</h3>
        <button
          type="button"
          onClick={handleRegenerateCover}
          disabled={loading}
          className="btn-secondary text-xs py-1.5"
          title="Fetch a new Unsplash photo from topic/tags — content unchanged"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {displayUrl ? 'Regenerate cover' : 'Fetch cover'}
        </button>
      </div>
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Blog cover"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageIcon className="w-10 h-10 opacity-40" />
            <p className="text-xs px-4 text-center">No cover yet — click Fetch cover</p>
          </div>
        )}
      </div>
      <p className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800">
        Unsplash · topic-based · listing cards &amp; social share
      </p>
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
