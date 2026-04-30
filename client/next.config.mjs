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
        source: '/Marketing/best-crm-software',
        destination: '/marketing/best-crm-software',
        permanent: true,
      },
      {
        source: '/Marketing/best-email-marketing-services',
        destination: '/marketing/best-email-marketing-services',
        permanent: true,
      },
      {
        source: '/Marketing/best-website-building-platform',
        destination: '/marketing/best-website-building-platform',
        permanent: true,
      },
      {
        source: '/Sales/best-crm-software',
        destination: '/sales/best-crm-software',
        permanent: true,
      },
      {
        source: '/Sales/best-project-management-software',
        destination: '/sales/best-project-management-software',
        permanent: true,
      },
      {
        source: '/Sales/best-call-center-management-software',
        destination: '/sales/best-call-center-management-software',
        permanent: true,
      },
      {
        source: '/Technology/business-phone-systems',
        destination: '/technology/business-phone-systems',
        permanent: true,
      },
      {
        source: '/Technology/gps-fleet-management-software',
        destination: '/technology/gps-fleet-management-software',
        permanent: true,
      },
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
}
export default nextConfig
