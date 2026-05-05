import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, KeyRound, ArrowRight, RefreshCw, PenTool, Loader2 } from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useBlogAdminTheme } from '../../hooks/useBlogAdminTheme'
import { ThemeSwitch } from '../ui/ThemeSwitch'

export const LoginPage = ({ toast }) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [darkMode, setDarkMode] = useBlogAdminTheme()
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState(null)
  const [countdown, setCountdown] = useState(0)

  const startCountdown = () => {
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const normalizedEmail = () => email.trim().toLowerCase()

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/auth/request-otp', { email: normalizedEmail() })
      toast.success(res.message)
      if (res.dev_otp) setDevOtp(res.dev_otp)
      setStep('otp')
      startCountdown()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email: normalizedEmail(), otp })
      login(res.token, res.admin)
      toast.success(res.message)
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <SiteNav />

      <main className="relative flex flex-1 flex-col justify-center bg-gradient-to-br from-navy via-navy-mid to-blue-900 px-4 py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-400" />
        </div>

        <div className="relative mx-auto w-full max-w-md">
        <div className="flex justify-end mb-6">
          <div className="rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
            <ThemeSwitch
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              labelClassName="text-white/90"
            />
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl text-white mb-2">Blog Admin</h1>
          <p className="text-white/60 text-sm">Automation Dashboard</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xl shadow-navy/10 ring-1 ring-black/[0.03] dark:border-gray-700 dark:bg-gray-900 dark:ring-white/[0.06]">
          {/* Single progress bar — full width */}
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-brand to-blue-600 transition-[width] duration-500 ease-out"
              style={{ width: step === 'email' ? '42%' : '100%' }}
              aria-hidden
            />
          </div>

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            {step === 'email' ? (
              <>
                <div className="mb-7 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand dark:text-blue-400">Step 1 of 2</p>
                  <h2 className="font-sans text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:text-[1.35rem]">
                    Sign in
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Enter your admin email — we&apos;ll send a one-time password.
                  </p>
                </div>
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="blog-admin-email" className="label">
                      Email address
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 shadow-inner transition-all focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/20 dark:border-gray-600 dark:bg-gray-800/50 dark:shadow-none dark:focus-within:border-brand dark:focus-within:bg-gray-800 dark:focus-within:ring-brand/25">
                      <span className="flex shrink-0 text-gray-400 dark:text-gray-500" aria-hidden>
                        <Mail className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <input
                        id="blog-admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yourdomain.com"
                        required
                        autoFocus
                        autoComplete="email"
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="btn-primary w-full justify-center py-3.5 text-[15px] shadow-md shadow-brand/25 transition hover:shadow-lg hover:shadow-brand/30 disabled:shadow-none"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-7 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setOtp('')
                      setDevOtp(null)
                    }}
                    className="text-sm font-medium text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ← Back to email
                  </button>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand dark:text-blue-400">Step 2 of 2</p>
                  <h2 className="font-sans text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:text-[1.35rem]">
                    Enter OTP
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Check your inbox at{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">{email}</span>
                  </p>
                </div>

                {devOtp && (
                  <div className="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">Dev mode OTP</p>
                    <p className="mt-1 font-mono text-2xl font-bold tracking-[0.35em] text-yellow-900 dark:text-yellow-300">{devOtp}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="blog-admin-otp" className="label">
                      6-digit code
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 shadow-inner transition-all focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/20 dark:border-gray-600 dark:bg-gray-800/50 dark:shadow-none dark:focus-within:border-brand dark:focus-within:bg-gray-800 dark:focus-within:ring-brand/25">
                      <span className="flex shrink-0 text-gray-400 dark:text-gray-500" aria-hidden>
                        <KeyRound className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <input
                        id="blog-admin-otp"
                        inputMode="numeric"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        required
                        autoFocus
                        autoComplete="one-time-code"
                        maxLength={6}
                        className="min-w-0 flex-1 border-0 bg-transparent py-0.5 text-center font-mono text-xl tracking-[0.55em] text-gray-900 outline-none placeholder:text-gray-300 placeholder:tracking-[0.55em] dark:text-gray-100 dark:placeholder:text-gray-600 sm:text-2xl sm:tracking-[0.65em]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn-primary w-full justify-center py-3.5 text-[15px] shadow-md shadow-brand/25 transition hover:shadow-lg hover:shadow-brand/30 disabled:shadow-none"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Verify &amp; login</span>
                        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                      </>
                    )}
                  </button>
                  <div className="text-center pt-0.5">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-400">Resend OTP in {countdown}s</p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="mx-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline dark:text-blue-400"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Blog Automation Dashboard · Powered by Claude AI
        </p>
        </div>
      </main>

      <SiteFooter className="!mt-0" />
    </div>
  )
}
