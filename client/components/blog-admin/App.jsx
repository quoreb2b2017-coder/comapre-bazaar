import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/layout/Layout'
import { Toast } from './components/ui/Toast'
import {
  LoginPage,
  Dashboard,
  Blogs,
  BlogDetail,
  GenerateBlog,
  Approvals,
  Settings,
  TrendsAssistant,
  Analytics,
  CookiesReport,
  Subscribers,
} from './lazyRoutes'
import { useToast } from './hooks/useToast'
import { BlogAdminPageLoader } from './components/ui/PageLoader'
import { RouteSuspense } from './components/ui/RouteSuspense'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <BlogAdminPageLoader label="Loading dashboard…" />
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <BlogAdminPageLoader label="Preparing sign in…" />
  }
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { toasts, toast, removeToast } = useToast()

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Suspense fallback={<BlogAdminPageLoader label="Loading sign in…" />}>
              <LoginPage toast={toast} />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout toast={toast} />
          </ProtectedRoute>
        }>
          <Route index element={<RouteSuspense><Dashboard /></RouteSuspense>} />
          <Route path="blogs" element={<RouteSuspense><Blogs /></RouteSuspense>} />
          <Route path="blogs/:id" element={<RouteSuspense><BlogDetail /></RouteSuspense>} />
          <Route path="blogs/:id/edit" element={<RouteSuspense><BlogDetail /></RouteSuspense>} />
          <Route path="generate" element={<RouteSuspense><GenerateBlog /></RouteSuspense>} />
          <Route path="approvals" element={<RouteSuspense><Approvals /></RouteSuspense>} />
          <Route path="settings" element={<RouteSuspense><Settings /></RouteSuspense>} />
          <Route path="trends" element={<RouteSuspense><TrendsAssistant /></RouteSuspense>} />
          <Route path="analytics" element={<RouteSuspense><Analytics /></RouteSuspense>} />
          <Route path="cookies-report" element={<RouteSuspense><CookiesReport /></RouteSuspense>} />
          <Route path="subscribers" element={<RouteSuspense><Subscribers /></RouteSuspense>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        basename="/blog-admin"
        future={{
          // Do not enable v7_startTransition — it defers Suspense fallbacks so route loading rarely shows.
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
