/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.compare-bazaar.com' },
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
    ]
  },
}
export default nextConfig
