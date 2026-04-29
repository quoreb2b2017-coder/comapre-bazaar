import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubBySlug } from '@/data/hubs'
import { buildMetadata } from '@/lib/seo'
import { HubPageTemplate } from '@/components/comparison/HubPageTemplate'

const data = getHubBySlug('technology')

export const metadata: Metadata = data
  ? buildMetadata({ title: data.title, description: data.metaDescription, canonical: data.canonical })
  : {}

export default function Page() {
  if (!data) notFound()
  return <HubPageTemplate data={data} />
}
