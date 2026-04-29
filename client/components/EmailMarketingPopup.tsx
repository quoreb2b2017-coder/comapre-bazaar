'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import EmailMarketingForm from '@/components/EmailMarketingForm'
import CRMForm from '@/components/CRMForm'
import WebsiteBuildingForm from '@/components/WebsiteBuildingForm'
import PayrollForm from '@/components/PayrollForm'
import GPSFleetForm from '@/components/GPSFleetForm'
import BusinessPhoneSystemForm from '@/components/BusinessPhoneSystemForm'
import Employeeform from '@/components/Employeeform'
import CallCenterForm from '@/components/CallCenterForm'
import ProjectManagementForm from '@/components/ProjectManagementForm'

function PopupShell({
  title,
  children,
}: {
  title: string
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
    <div className="fixed inset-0 z-[90] bg-black/55 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg font-semibold text-navy">{title}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close form popup"
            className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            x
          </button>
        </div>
        <div className="p-4 sm:p-5">
          {children(() => setOpen(false))}
        </div>
      </div>
    </div>
  )
}

export function EmailMarketingPopup() {
  return (
    <PopupShell title="Get Email Marketing Quotes">
      {(close) => <EmailMarketingForm onClose={close} />}
    </PopupShell>
  )
}

export function CRMPopup() {
  return (
    <PopupShell title="Get CRM Quotes">
      {(close) => <CRMForm onClose={close} />}
    </PopupShell>
  )
}

export function WebsiteBuildingPopup() {
  return (
    <PopupShell title="Get Website Building Quotes">
      {(close) => <WebsiteBuildingForm onClose={close} />}
    </PopupShell>
  )
}

export function PayrollPopup() {
  return (
    <PopupShell title="Get Payroll Software Quotes">
      {(close) => <PayrollForm onClose={close} />}
    </PopupShell>
  )
}

export function GPSFleetPopup() {
  return (
    <PopupShell title="Get GPS Fleet Management Quotes">
      {(close) => <GPSFleetForm onClose={close} />}
    </PopupShell>
  )
}

export function BusinessPhoneSystemPopup() {
  return (
    <PopupShell title="Get Business Phone System Quotes">
      {(close) => <BusinessPhoneSystemForm onClose={close} />}
    </PopupShell>
  )
}

export function EmployeeManagementPopup() {
  return (
    <PopupShell title="Get Employee Management Quotes">
      {(close) => <Employeeform onClose={close} />}
    </PopupShell>
  )
}

export function CallCenterPopup() {
  return (
    <PopupShell title="Get Call Center Software Quotes">
      {(close) => <CallCenterForm onClose={close} />}
    </PopupShell>
  )
}

export function ProjectManagementPopup() {
  return (
    <PopupShell title="Get Project Management Software Quotes">
      {(close) => <ProjectManagementForm onClose={close} />}
    </PopupShell>
  )
}
