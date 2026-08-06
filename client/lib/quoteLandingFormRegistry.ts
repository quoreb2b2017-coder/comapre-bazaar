import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import {
  Briefcase,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react'
import CRMForm from '@/components/CRMForm'
import PayrollForm from '@/components/PayrollForm'
import CallCenterForm from '@/components/CallCenterForm'
import ProjectManagementForm from '@/components/ProjectManagementForm'
import EmailMarketingForm from '@/components/EmailMarketingForm'
import WebsiteBuildingForm from '@/components/WebsiteBuildingForm'
import GPSFleetForm from '@/components/GPSFleetForm'
import BusinessPhoneSystemForm from '@/components/BusinessPhoneSystemForm'
import Employeeform from '@/components/Employeeform'

export type QuoteLandingFormKey =
  | 'crm'
  | 'payroll'
  | 'call-center'
  | 'project-management'
  | 'email-marketing'
  | 'website-building'
  | 'gps-fleet'
  | 'business-phone'
  | 'employee-management'

type PopupFormComponent = ComponentType<{ onClose?: () => void }>

export type QuoteLandingFormConfig = {
  title: string
  icon: LucideIcon
  Form: PopupFormComponent
}

export const QUOTE_LANDING_FORMS: Record<QuoteLandingFormKey, QuoteLandingFormConfig> = {
  crm: {
    title: 'Save by Comparing CRM Software Quotes',
    icon: Users,
    Form: CRMForm as PopupFormComponent,
  },
  payroll: {
    title: 'Get Payroll Software Quotes',
    icon: Briefcase,
    Form: PayrollForm as PopupFormComponent,
  },
  'call-center': {
    title: 'Get Call Center Software Quotes',
    icon: Headphones,
    Form: CallCenterForm as PopupFormComponent,
  },
  'project-management': {
    title: 'Get Project Management Software Quotes',
    icon: Briefcase,
    Form: ProjectManagementForm as PopupFormComponent,
  },
  'email-marketing': {
    title: 'Get Email Marketing Quotes',
    icon: Mail,
    Form: EmailMarketingForm as PopupFormComponent,
  },
  'website-building': {
    title: 'Get Website Building Quotes',
    icon: Sparkles,
    Form: WebsiteBuildingForm as PopupFormComponent,
  },
  'gps-fleet': {
    title: 'Get GPS Fleet Management Quotes',
    icon: MapPin,
    Form: GPSFleetForm as PopupFormComponent,
  },
  'business-phone': {
    title: 'Get Business Phone System Quotes',
    icon: Phone,
    Form: BusinessPhoneSystemForm as PopupFormComponent,
  },
  'employee-management': {
    title: 'Get Employee Management Quotes',
    icon: Users,
    Form: Employeeform as PopupFormComponent,
  },
}
