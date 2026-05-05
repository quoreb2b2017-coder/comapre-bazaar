'use client'

import dynamic from 'next/dynamic'
import { BlogAdminPageLoader } from '@/components/blog-admin/components/ui/PageLoader'

const BlogAdminApp = dynamic(() => import('@/components/blog-admin/App'), {
  ssr: false,
  loading: () => <BlogAdminPageLoader label="Loading blog admin…" />,
})

export default function BlogAdminCatchAllPage() {
  return <BlogAdminApp />
}
