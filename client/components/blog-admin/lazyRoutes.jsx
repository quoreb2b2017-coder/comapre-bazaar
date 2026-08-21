import { lazy } from 'react'

/**
 * Code-split admin pages — webpackChunkName keeps separate async chunks in Next production builds.
 */
export const Dashboard = lazy(() =>
  import(/* webpackChunkName: "blog-admin-dashboard" */ './pages/Dashboard').then((m) => ({ default: m.Dashboard })),
)
export const Blogs = lazy(() =>
  import(/* webpackChunkName: "blog-admin-blogs" */ './pages/Blogs').then((m) => ({ default: m.Blogs })),
)
export const BlogDetail = lazy(() =>
  import(/* webpackChunkName: "blog-admin-blog-detail" */ './pages/BlogDetail').then((m) => ({ default: m.BlogDetail })),
)
export const GenerateBlog = lazy(() =>
  import(/* webpackChunkName: "blog-admin-generate" */ './pages/GenerateBlog').then((m) => ({ default: m.GenerateBlog })),
)
export const ExcelQueue = lazy(() =>
  import(/* webpackChunkName: "blog-admin-excel-queue" */ './pages/ExcelQueue').then((m) => ({ default: m.ExcelQueue })),
)
export const Approvals = lazy(() =>
  import(/* webpackChunkName: "blog-admin-approvals" */ './pages/Approvals').then((m) => ({ default: m.Approvals })),
)
export const Settings = lazy(() =>
  import(/* webpackChunkName: "blog-admin-settings" */ './pages/Settings').then((m) => ({ default: m.Settings })),
)
export const TrendsAssistant = lazy(() =>
  import(/* webpackChunkName: "blog-admin-trends" */ './pages/TrendsAssistant').then((m) => ({ default: m.TrendsAssistant })),
)
export const Analytics = lazy(() =>
  import(/* webpackChunkName: "blog-admin-analytics" */ './pages/Analytics').then((m) => ({ default: m.Analytics })),
)
export const SuperAdminGoogleAnalytics = lazy(() =>
  import(/* webpackChunkName: "blog-admin-super-admin-ga" */ './pages/SuperAdminGoogleAnalytics').then((m) => ({
    default: m.SuperAdminGoogleAnalytics,
  })),
)
export const CookiesReport = lazy(() =>
  import(/* webpackChunkName: "blog-admin-cookies" */ './pages/CookiesReport').then((m) => ({ default: m.CookiesReport })),
)
export const Subscribers = lazy(() =>
  import(/* webpackChunkName: "blog-admin-subscribers" */ './pages/Subscribers').then((m) => ({ default: m.Subscribers })),
)
export const WhitePapers = lazy(() =>
  import(/* webpackChunkName: "blog-admin-whitepapers" */ './pages/WhitePapers').then((m) => ({ default: m.WhitePapers })),
)
export const WhitePaperDownloads = lazy(() =>
  import(/* webpackChunkName: "blog-admin-whitepaper-downloads" */ './pages/WhitePaperDownloads').then((m) => ({
    default: m.WhitePaperDownloads,
  })),
)
export const WhitePaperCreate = lazy(() =>
  import(/* webpackChunkName: "blog-admin-whitepaper-create" */ './pages/WhitePaperCreate').then((m) => ({
    default: m.WhitePaperCreate,
  })),
)
export const ServicePages = lazy(() =>
  import(/* webpackChunkName: "blog-admin-service-pages" */ './pages/ServicePages').then((m) => ({
    default: m.ServicePages,
  })),
)
export const LoginPage = lazy(() =>
  import(/* webpackChunkName: "blog-admin-login" */ './components/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)

/** Warm admin chunks after first paint so sidebar clicks do not wait on webpack. */
export function prefetchBlogAdminRoutes() {
  void import('./pages/Dashboard')
  void import('./pages/Blogs')
  void import('./pages/BlogDetail')
  void import('./pages/GenerateBlog')
  void import('./pages/ExcelQueue')
  void import('./pages/Approvals')
  void import('./pages/Settings')
  void import('./pages/TrendsAssistant')
  void import('./pages/Analytics')
  void import('./pages/SuperAdminGoogleAnalytics')
  void import('./pages/CookiesReport')
  void import('./pages/Subscribers')
  void import('./pages/WhitePapers')
  void import('./pages/WhitePaperDownloads')
  void import('./pages/WhitePaperCreate')
  void import('./pages/ServicePages')
}
