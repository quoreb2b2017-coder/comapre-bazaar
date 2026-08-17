import { cache } from 'react'
import {
  fetchPublishedWhitePapers as loadPublishedWhitePapers,
  fetchWhitePaperBySlug as loadWhitePaperBySlug,
} from '@/lib/whitePaperCms'

/** One network round-trip per request for generateMetadata + the page. */
export const fetchPublishedWhitePapers = cache(loadPublishedWhitePapers)
export const fetchWhitePaperBySlug = cache(loadWhitePaperBySlug)
