/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.compare-bazaar.com' },
    ],
  },
}
export default nextConfig
