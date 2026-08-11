'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
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
import EmailMarketingForm from '@/components/EmailMarketingForm'
import CRMForm from '@/components/CRMForm'
import WebsiteBuildingForm from '@/components/WebsiteBuildingForm'
import PayrollForm from '@/components/PayrollForm'
import GPSFleetForm from '@/components/GPSFleetForm'
import BusinessPhoneSystemForm from '@/components/BusinessPhoneSystemForm'
import Employeeform from '@/components/Employeeform'
import CallCenterForm from '@/components/CallCenterForm'
import ProjectManagementForm from '@/components/ProjectManagementForm'

export function PopupShell({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/55 p-4 backdrop-blur-[3px]">
      <div
        className="quote-popup-panel relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-cb-orange-border/40 bg-white shadow-[0_20px_60px_-16px_rgba(15,31,61,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-popup-title"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cb-orange via-cb-orange-mid to-cb-orange" />
        <div className="relative shrink-0 border-b border-gray-100 bg-gradient-to-b from-cb-orange-soft/60 to-white px-4 pb-3 pt-4 sm:px-5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close form popup"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-navy"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
          <div className="flex items-center gap-2.5 pr-8">
            {Icon ? (
              <span className="quote-form-icon-badge relative flex h-10 w-10 shrink-0 items-center justify-center">
                <span
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-light via-white to-blue-50 ring-2 ring-brand/30 shadow-[0_0_0_3px_rgba(29,78,216,0.14),0_3px_10px_-3px_rgba(29,78,216,0.35)]"
                  aria-hidden
                />
                <Icon className="relative h-[19px] w-[19px] text-brand" strokeWidth={1.9} aria-hidden />
              </span>
            ) : null}
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cb-orange">
                Free quotes · No obligation
              </p>
              <h2
                id="quote-popup-title"
                className="font-serif text-base font-normal leading-snug text-navy sm:text-lg"
              >
                {title}
              </h2>
            </div>
          </div>
        </div>
        <div className="quote-popup-body scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          {children(() => setOpen(false))}
        </div>
      </div>
    </div>
  )
}

export function EmailMarketingPopup() {
  return (
    <PopupShell title="Get Email Marketing Quotes" icon={Mail}>
      {(close) => <EmailMarketingForm onClose={close} />}
    </PopupShell>
  )
}

export function CRMPopup() {
  return (
    <PopupShell title="Save by Comparing CRM Software Quotes" icon={Users}>
      {(close) => <CRMForm onClose={close} />}
    </PopupShell>
  )
}

export function WebsiteBuildingPopup() {
  return (
    <PopupShell title="Get Website Building Quotes" icon={Sparkles}>
      {(close) => <WebsiteBuildingForm onClose={close} />}
    </PopupShell>
  )
}

export function PayrollPopup() {
  return (
    <PopupShell title="Get Payroll Software Quotes" icon={Briefcase}>
      {(close) => <PayrollForm onClose={close} />}
    </PopupShell>
  )
}

export function GPSFleetPopup() {
  return (
    <PopupShell title="Get Fleet Management Software Quotes" icon={MapPin}>
      {(close) => <GPSFleetForm onClose={close} />}
    </PopupShell>
  )
}

export function BusinessPhoneSystemPopup() {
  return (
    <PopupShell title="Get Business Phone System Quotes" icon={Phone}>
      {(close) => <BusinessPhoneSystemForm onClose={close} />}
    </PopupShell>
  )
}

export function EmployeeManagementPopup() {
  return (
    <PopupShell title="Get Employee Management Quotes" icon={Users}>
      {(close) => <Employeeform onClose={close} />}
    </PopupShell>
  )
}

export function CallCenterPopup() {
  return (
    <PopupShell title="Get Call Center Software Quotes" icon={Headphones}>
      {(close) => <CallCenterForm onClose={close} />}
    </PopupShell>
  )
}

export function ProjectManagementPopup() {
  return (
    <PopupShell title="Get Project Management Software Quotes" icon={Briefcase}>
      {(close) => <ProjectManagementForm onClose={close} />}
    </PopupShell>
  )
}
