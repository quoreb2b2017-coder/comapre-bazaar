import type { ComponentType } from 'react'
import {
  HandshakeIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from '@/components/ui/icons'

export type HomeCategory = {
  href: string
  quotesHref: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  shortTitle: string
  vendors: string
  title: string
  desc: string
  blurb: string
  /** Short line on homepage hero cards */
  cardTagline: string
}

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    href: '/technology/business-phone-systems',
    quotesHref: '/technology/business-phone-systems/get-free-quotes',
    icon: PhoneIcon,
    shortTitle: 'VoIP & UCaaS',
    vendors: '6 vendors',
    title: 'Best VoIP & Business Phone Systems',
    desc: 'RingCentral, Nextiva, and Ooma compared on call quality, mobile apps, and SMB pricing.',
    blurb: 'Compare call quality, mobile apps, and real per-user pricing before you sign a contract.',
    cardTagline: 'Compare the best VoIP & business phone systems.',
  },
  {
    href: '/human-resources/best-payroll-software',
    quotesHref: '/human-resources/best-payroll-software/get-free-quotes',
    icon: WalletIcon,
    shortTitle: 'Payroll',
    vendors: '8 vendors',
    title: 'Best Payroll Software for Small Business',
    desc: 'ADP, Gusto, OnPay, and Rippling compared on tax compliance, contractor support, and integrations.',
    blurb: 'See which tools handle taxes, contractors, and direct deposit without surprise fees.',
    cardTagline: 'Compare the best payroll software for SMBs.',
  },
  {
    href: '/human-resources',
    quotesHref: '/human-resources/best-employee-management-software/get-free-quotes',
    icon: UsersIcon,
    shortTitle: 'HR Software',
    vendors: '7 vendors',
    title: 'Best HR Software for 2026',
    desc: 'BambooHR, Rippling, Workday compared on onboarding, performance tools, and company size fit.',
    blurb: 'Find HR software that fits your team - onboarding, PTO, and people ops in one place.',
    cardTagline: 'Compare the best HR software for your team.',
  },
  {
    href: '/marketing/best-crm-software',
    quotesHref: '/marketing/best-crm-software/get-free-quote',
    icon: HandshakeIcon,
    shortTitle: 'CRM',
    vendors: '11 vendors',
    title: 'Best CRM Software of 2026',
    desc: 'Compare HubSpot, Salesforce, Zoho, and 8 more on pipeline management, automation, and pricing.',
    blurb: 'Shortlist CRMs by pipeline tools, automation, and what you will actually pay as you grow.',
    cardTagline: 'Compare the best CRM software for 2026.',
  },
  {
    href: '/technology/gps-fleet-management-software',
    quotesHref: '/technology/gps-fleet-management-software/get-free-quotes',
    icon: TruckIcon,
    shortTitle: 'GPS Fleet',
    vendors: '7 vendors',
    title: 'Best GPS Fleet Management Software',
    desc: 'Samsara, Motive, and Verizon Connect compared on tracking, safety, and fleet visibility.',
    blurb: 'Track vehicles, cut fuel waste, and keep drivers safer with tools built for small fleets.',
    cardTagline: 'Compare the best GPS fleet management tools.',
  },
  {
    href: '/marketing/best-email-marketing-services',
    quotesHref: '/marketing/best-email-marketing-services/get-free-quotes',
    icon: MailIcon,
    shortTitle: 'Email Marketing',
    vendors: '9 vendors',
    title: 'Best Email Marketing Services',
    desc: 'Mailchimp, Klaviyo, ActiveCampaign ranked on deliverability, automation depth, and list pricing.',
    blurb: 'Compare deliverability, automations, and list pricing before your next campaign goes out.',
    cardTagline: 'Compare the best email marketing platforms.',
  },
]

export const HERO_SEARCH_ITEMS = HOME_CATEGORIES.map((c) => ({
  href: c.href,
  label: `${c.shortTitle} ${c.title}`,
  shortLabel: c.shortTitle,
}))
