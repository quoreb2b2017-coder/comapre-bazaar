'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import CRMForm from '@/components/CRMForm'
import EmailMarketingForm from '@/components/EmailMarketingForm'
import WebsiteBuildingForm from '@/components/WebsiteBuildingForm'
import PayrollForm from '@/components/PayrollForm'
import GPSFleetForm from '@/components/GPSFleetForm'
import BusinessPhoneSystemForm from '@/components/BusinessPhoneSystemForm'
import Employeeform from '@/components/Employeeform'
import CallCenterForm from '@/components/CallCenterForm'
import ProjectManagementForm from '@/components/ProjectManagementForm'
import {
  blogQuoteDismissKey,
  resolveBlogQuoteMatch,
  type BlogQuoteMatch,
} from '@/lib/blogQuoteMatch'
import type { ReviewQuotePopupKind } from '@/lib/reviewQuotePopup'

type BlogQuoteContextValue = {
  match: BlogQuoteMatch
  openQuotePopup: () => void
  closeQuotePopup: () => void
  isOpen: boolean
}

const BlogQuoteContext = createContext<BlogQuoteContextValue | null>(null)

export function useBlogQuote() {
  const ctx = useContext(BlogQuoteContext)
  if (!ctx) throw new Error('useBlogQuote must be used within BlogQuoteProvider')
  return ctx
}

export function useBlogQuoteOptional() {
  return useContext(BlogQuoteContext)
}

const KIND_ICONS: Record<ReviewQuotePopupKind, LucideIcon> = {
  crm: Users,
  'email-marketing': Mail,
  'website-building': Sparkles,
  payroll: Briefcase,
  'business-phone': Phone,
  'gps-fleet': MapPin,
  'employee-management': Users,
  'call-center': Headphones,
  'project-management': Briefcase,
}

function QuoteFormBody({ kind, onClose }: { kind: ReviewQuotePopupKind; onClose: () => void }) {
  switch (kind) {
    case 'crm':
      return <CRMForm onClose={onClose} />
    case 'email-marketing':
      return <EmailMarketingForm onClose={onClose} />
    case 'website-building':
      return <WebsiteBuildingForm onClose={onClose} />
    case 'payroll':
      return <PayrollForm onClose={onClose} />
    case 'business-phone':
      return <BusinessPhoneSystemForm onClose={onClose} />
    case 'gps-fleet':
      return <GPSFleetForm onClose={onClose} />
    case 'employee-management':
      return <Employeeform onClose={onClose} />
    case 'call-center':
      return <CallCenterForm onClose={onClose} />
    case 'project-management':
      return <ProjectManagementForm onClose={onClose} />
    default:
      return null
  }
}

type ProviderProps = {
  slug: string
  topic?: string
  tags?: string[]
  title?: string
  children: ReactNode
}

export function BlogQuoteProvider({ slug, topic, tags, title, children }: ProviderProps) {
  const match = useMemo(() => resolveBlogQuoteMatch({ topic, tags, slug, title }), [topic, tags, slug, title])
  const [isOpen, setIsOpen] = useState(false)

  const openQuotePopup = useCallback(() => setIsOpen(true), [])
  const closeQuotePopup = useCallback(() => {
    setIsOpen(false)
    try {
      sessionStorage.setItem(blogQuoteDismissKey(slug), '1')
    } catch {
      /* ignore */
    }
  }, [slug])

  useEffect(() => {
    if (!match.kind) return

    let cancelled = false
    let scrollTriggered = false

    const tryOpen = () => {
      if (cancelled) return
      try {
        if (sessionStorage.getItem(blogQuoteDismissKey(slug)) === '1') return
      } catch {
        /* ignore */
      }
      setIsOpen(true)
    }

    const onScroll = () => {
      if (scrollTriggered) return
      const doc = document.documentElement
      const scrolled = doc.scrollTop / Math.max(doc.scrollHeight - doc.clientHeight, 1)
      if (scrolled >= 0.22) {
        scrollTriggered = true
        window.setTimeout(tryOpen, 1200)
      }
    }

    const timer = window.setTimeout(tryOpen, 7000)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [match.kind, slug])

  const Icon = match.kind ? KIND_ICONS[match.kind] : Briefcase

  return (
    <BlogQuoteContext.Provider value={{ match, openQuotePopup, closeQuotePopup, isOpen }}>
      {children}

      {isOpen && match.kind ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/55 p-4 backdrop-blur-[3px]">
          <div
            className="quote-popup-panel relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-cb-orange-border/40 bg-white shadow-[0_20px_60px_-16px_rgba(15,31,61,0.35)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-quote-popup-title"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cb-orange via-cb-orange-mid to-cb-orange" />
            <div className="relative shrink-0 border-b border-gray-100 bg-gradient-to-b from-cb-orange-soft/60 to-white px-4 pb-3 pt-4 sm:px-5">
              <button
                type="button"
                onClick={closeQuotePopup}
                aria-label="Close quote form"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-navy"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
              <div className="flex items-center gap-2.5 pr-8">
                <span className="quote-form-icon-badge relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-light via-white to-blue-50 ring-2 ring-brand/30 shadow-[0_0_0_3px_rgba(29,78,216,0.14),0_3px_10px_-3px_rgba(29,78,216,0.35)]"
                    aria-hidden
                  />
                  <Icon className="relative h-[19px] w-[19px] text-brand" strokeWidth={1.9} aria-hidden />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cb-orange">
                    Free quotes · No obligation
                  </p>
                  <h2
                    id="blog-quote-popup-title"
                    className="font-serif text-base font-normal leading-snug text-navy sm:text-lg"
                  >
                    {match.popupTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Matched to this article&apos;s topic - {match.categoryLabel}
                  </p>
                </div>
              </div>
            </div>
            <div className="quote-popup-body scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
              <QuoteFormBody kind={match.kind} onClose={closeQuotePopup} />
            </div>
          </div>
        </div>
      ) : null}
    </BlogQuoteContext.Provider>
  )
}
