'use client'

import CRMForm from '@/components/CRMForm'
import EmailMarketingForm from '@/components/EmailMarketingForm'
import WebsiteBuildingForm from '@/components/WebsiteBuildingForm'
import PayrollForm from '@/components/PayrollForm'
import GPSFleetForm from '@/components/GPSFleetForm'
import BusinessPhoneSystemForm from '@/components/BusinessPhoneSystemForm'
import Employeeform from '@/components/Employeeform'
import CallCenterForm from '@/components/CallCenterForm'
import ProjectManagementForm from '@/components/ProjectManagementForm'
import { PopupShell } from '@/components/EmailMarketingPopup'
import { getReviewQuotePopup } from '@/lib/reviewQuotePopup'

type ReviewQuotePopupProps = {
  categoryPath: string
  reviewName: string
}

export function ReviewQuotePopup({ categoryPath, reviewName }: ReviewQuotePopupProps) {
  const config = getReviewQuotePopup(categoryPath, reviewName)
  if (!config) return null

  const { kind, title } = config

  return (
    <PopupShell title={title}>
      {(close) => {
        switch (kind) {
          case 'crm':
            return <CRMForm onClose={close} />
          case 'email-marketing':
            return <EmailMarketingForm onClose={close} />
          case 'website-building':
            return <WebsiteBuildingForm onClose={close} />
          case 'payroll':
            return <PayrollForm onClose={close} />
          case 'business-phone':
            return <BusinessPhoneSystemForm onClose={close} />
          case 'gps-fleet':
            return <GPSFleetForm onClose={close} />
          case 'employee-management':
            return <Employeeform onClose={close} />
          case 'call-center':
            return <CallCenterForm onClose={close} />
          case 'project-management':
            return <ProjectManagementForm onClose={close} />
          default:
            return null
        }
      }}
    </PopupShell>
  )
}
