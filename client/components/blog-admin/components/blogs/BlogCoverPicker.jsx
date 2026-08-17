import { useEffect, useRef, useState } from 'react'
import { ImageIcon, Loader2, RefreshCw, Upload, X } from 'lucide-react'
import api, { blogAdminHttp, ensureBlogAdminBaseURL } from '../../utils/api'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

function sourceFromUrl(url) {
  const value = String(url || '')
  if (!value) return 'unsplash'
  if (/unsplash\.com/i.test(value)) return 'unsplash'
  return 'upload'
}

/**
 * Cover picker used on Generate Blog and blog detail.
 * source: 'upload' | 'unsplash'
 */
export function BlogCoverPicker({
  blogId,
  coverImageUrl = '',
  topic = '',
  title = '',
  tags = [],
  keywords = [],
  toast,
  onChange,
  compact = false,
}) {
  const fileRef = useRef(null)
  const [source, setSource] = useState(() => sourceFromUrl(coverImageUrl))
  const [url, setUrl] = useState(coverImageUrl || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [busy, setBusy] = useState('')
  const [localPreview, setLocalPreview] = useState('')

  useEffect(() => {
    setUrl(coverImageUrl || '')
    if (coverImageUrl) setSource(sourceFromUrl(coverImageUrl))
  }, [coverImageUrl])

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const displayUrl = localPreview || url
  const emit = (nextUrl, nextSource, nextQuery) => {
    setUrl(nextUrl || '')
    onChange?.({
      coverImageUrl: nextUrl || '',
      coverSource: nextSource || source,
      coverSearchQuery: nextQuery || searchQuery || '',
    })
  }

  const switchSource = (next) => {
    setSource(next)
    const keepUrl = next === 'upload' || /unsplash\.com/i.test(url) ? url : ''
    if (keepUrl !== url) setUrl(keepUrl)
    onChange?.({
      coverImageUrl: keepUrl,
      coverSource: next,
      coverSearchQuery: next === 'unsplash' ? searchQuery : '',
    })
  }

  const uploadFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast?.error('Please choose a JPG, PNG, WebP, or GIF image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast?.error('Image must be 5 MB or smaller')
      return
    }

    const preview = URL.createObjectURL(file)
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return preview
    })
    setSource('upload')
    setBusy('upload')

    try {
      await ensureBlogAdminBaseURL()
      const form = new FormData()
      form.append('image', file)
      const endpoint = blogId ? `/blogs/${blogId}/cover-upload` : '/blogs/cover-upload'
      const res = await blogAdminHttp.post(endpoint, form, { timeout: 60000 })
      const payload = res.data || {}
      const nextUrl = payload.coverImageUrl || payload.data?.coverImageUrl || ''
      if (!nextUrl) throw new Error('Upload did not return an image URL')
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return ''
      })
      setSearchQuery('')
      emit(nextUrl, 'upload', '')
      toast?.success(payload.message || 'Cover image uploaded')
    } catch (err) {
      toast?.error(err.response?.data?.message || err.message || 'Image upload failed')
    } finally {
      setBusy('')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const fetchUnsplash = async () => {
    const queryTopic = String(topic || title || '').trim()
    if (!queryTopic) {
      toast?.error('Enter a topic first so Unsplash can find a matching photo')
      return
    }
    setBusy('unsplash')
    setSource('unsplash')
    try {
      const endpoint = blogId ? `/blogs/${blogId}/regenerate-cover` : '/blogs/cover-unsplash'
      const res = await api.post(
        endpoint,
        blogId
          ? {}
          : {
              topic: queryTopic,
              title: title || queryTopic,
              tags,
              keywords,
              excludeCoverUrl: url || undefined,
            },
        { timeout: 30000 },
      )
      const nextUrl = res.coverImageUrl || res.data?.coverImageUrl || ''
      const nextQuery = res.coverSearchQuery || res.data?.coverSearchQuery || ''
      if (!nextUrl) throw new Error('No cover image returned from Unsplash')
      setSearchQuery(nextQuery)
      emit(nextUrl, 'unsplash', nextQuery)
      toast?.success(res.message || 'Cover image updated from Unsplash')
    } catch (err) {
      toast?.error(err.message || 'Failed to fetch Unsplash cover')
    } finally {
      setBusy('')
    }
  }

  const clearCover = () => {
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return ''
    })
    emit('', source, '')
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-3'}>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100/90 p-1 dark:bg-gray-800/80" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={source === 'upload'}
          onClick={() => switchSource('upload')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            source === 'upload'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload image
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={source === 'unsplash'}
          onClick={() => switchSource('unsplash')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            source === 'unsplash'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Unsplash
        </button>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {displayUrl ? (
          <img src={displayUrl} alt="Blog cover preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
            <ImageIcon className="h-9 w-9 opacity-40" />
            <p className="text-xs">
              {source === 'upload' ? 'No image uploaded yet' : 'No Unsplash photo yet'}
            </p>
          </div>
        )}
        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        ) : null}
      </div>

      {source === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={Boolean(busy)}
              className="btn-primary text-xs"
            >
              {busy === 'upload' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {url ? 'Replace image' : 'Choose image'}
            </button>
            {displayUrl ? (
              <button type="button" onClick={clearCover} className="btn-secondary text-xs">
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>
          <p className="text-[11px] text-gray-400">JPG, PNG, WebP, or GIF · max 5 MB. Used on listing cards and social share.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={fetchUnsplash}
            disabled={Boolean(busy)}
            className="btn-secondary text-xs"
            title="Fetch a topic-matching Unsplash photo"
          >
            {busy === 'unsplash' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {url ? 'Try another Unsplash photo' : 'Fetch Unsplash photo'}
          </button>
          <p className="text-[11px] text-gray-400">
            Uses your topic and keywords. You can also leave this and we will pick one when the blog is generated.
          </p>
        </div>
      )}
    </div>
  )
}
