/** @type {import('next').NextConfig} */
import { LEGACY_REDIRECTS } from './legacyRedirects.mjs'

const backendPublicUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''

const nextConfig = {
  /** Expose backend URL to the browser so uploads bypass the Next proxy (Vercel body limit). */
  env: {
    NEXT_PUBLIC_BACKEND_URL: backendPublicUrl,
  },
  /** When disk is full (ENOSPC), set DISABLE_WEBPACK_CACHE=1 — slower compiles, no pack cache writes. */
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_WEBPACK_CACHE === '1') {
      config.cache = false
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.compare-bazaar.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async redirects() {
    // Only path remaps — omit case-only normalizations (handled by middleware lowercasing).
    // Including case-only rules here loops: /marketing/… matches /Marketing/… on Vercel.
    return LEGACY_REDIRECTS.filter(
      ({ source, destination }) => source.toLowerCase() !== destination.toLowerCase()
    ).map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }))
  },
  async rewrites() {
    // Blog-admin API is handled by app/api/v1/blog-admin/[[...path]]/route.ts (multipart-safe proxy).
    return []
  },
}
export default nextConfig
