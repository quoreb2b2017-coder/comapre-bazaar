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
export const CookiesReport = lazy(() =>
  import(/* webpackChunkName: "blog-admin-cookies" */ './pages/CookiesReport').then((m) => ({ default: m.CookiesReport })),
)
export const Subscribers = lazy(() =>
  import(/* webpackChunkName: "blog-admin-subscribers" */ './pages/Subscribers').then((m) => ({ default: m.Subscribers })),
)
export const LoginPage = lazy(() =>
  import(/* webpackChunkName: "blog-admin-login" */ './components/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
