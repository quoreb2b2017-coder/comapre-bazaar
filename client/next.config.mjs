/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  async redirects() {
    return [
      {
        source: '/technology/best-payroll-system',
        destination: '/human-resources/best-payroll-software',
        permanent: true,
      },
      {
        source: '/technology/best-payroll-system/get-free-quotes',
        destination: '/human-resources/best-payroll-software/get-free-quotes',
        permanent: true,
      },
      {
        source: '/technology/best-employee-management-software',
        destination: '/human-resources/best-employee-management-software',
        permanent: true,
      },
      {
        source: '/technology/best-employee-management-software/get-free-quotes',
        destination: '/human-resources/best-employee-management-software/get-free-quotes',
        permanent: true,
      },
      {
        source: '/Technology/best-payroll-system',
        destination: '/human-resources/best-payroll-software',
        permanent: true,
      },
      {
        source: '/Technology/best-employee-management-software',
        destination: '/human-resources/best-employee-management-software',
        permanent: true,
      },
      {
        source: '/Contact-us/About-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/Contact-us/Contact',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/Resources/Blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/Resources/software-comparison-methodology',
        destination: '/editorial-process',
        permanent: true,
      },
      {
        source: '/Resources/smb-software-pricing-report-2026',
        destination: '/resources/whitepaper',
        permanent: true,
      },
      {
        source: '/Resources/link-building-playbook',
        destination: '/resources/whitepaper',
        permanent: true,
      },
      {
        source: '/BusinessPayroll',
        destination: '/human-resources/best-payroll-software',
        permanent: true,
      },
      {
        source: '/do-not-sell-my-info',
        destination: '/do-not-sell',
        permanent: true,
      },
      {
        source: '/accessibility-statement',
        destination: '/accessibility',
        permanent: true,
      },
      {
        source: '/marketing-solutions',
        destination: '/marketing',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:5000'
    return [
      {
        source: '/api/v1/blog-admin/:path*',
        destination: `${backend.replace(/\/$/, '')}/api/v1/blog-admin/:path*`,
      },
    ]
  },
}
export default nextConfig
