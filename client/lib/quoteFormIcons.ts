import {
  Activity,
  Banknote,
  BarChart3,
  Briefcase,
  Building,
  Building2,
  Bus,
  Calculator,
  CalendarClock,
  Car,
  CheckCircle2,
  CircleHelp,
  Clock,
  Cloud,
  Cpu,
  Eye,
  Factory,
  Filter,
  GraduationCap,
  HardHat,
  Headphones,
  HeartPulse,
  Home,
  Inbox,
  Kanban,
  Keyboard,
  Landmark,
  Layers,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Monitor,
  Package,
  Palette,
  Phone,
  PhoneCall,
  Plug,
  RefreshCw,
  Rocket,
  ScanLine,
  Send,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Store,
  Table,
  Target,
  Timer,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  UsersRound,
  Wallet,
  Wrench,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  Construction: HardHat,
  Ecommerce: ShoppingBag,
  Education: GraduationCap,
  'Financial Services': Banknote,
  Healthcare: HeartPulse,
  Manufacturing: Factory,
  'Professional Services': Briefcase,
  'Real Estate': Home,
  Retail: Store,
  Technology: Cpu,
  Other: CircleHelp,
}

export const FEATURE_ICONS: Record<string, LucideIcon> = {
  'Lead tracking and management': Target,
  'Customer service and success': Headphones,
  'Sales and forecasting tools': TrendingUp,
  '3rd party integrations': Plug,
  'Email marketing': Mail,
}

export const YES_NO_ICONS = {
  Yes: CheckCircle2,
  No: Lightbulb,
  yes: CheckCircle2,
  no: Lightbulb,
} as const

/** CRM employee-count tiers */
export const CRM_EMPLOYEE_ICONS: Record<string, LucideIcon> = {
  '100+': Building2,
  '50-99': Building,
  '21-49': UsersRound,
  '11-20': UserPlus,
  'Less than 10': User,
}

export const EMPLOYEE_COUNT_ICONS: Record<string, LucideIcon> = {
  ...CRM_EMPLOYEE_ICONS,
  'Less than 10 employees': User,
  '10 to 49': Users,
  '50 to 99': UsersRound,
  '100 to 250': Building,
  'More than 250': Building2,
}

export const PAYROLL_SOLUTION_ICONS: Record<string, LucideIcon> = {
  'Payroll software only': Calculator,
  'Both payroll software and service': Layers,
  'Payroll service only': Headphones,
}

export const FLEET_SIZE_ICONS: Record<string, LucideIcon> = {
  '1 - 4': Truck,
  '5 - 9': Truck,
  '10 - 19': Users,
  '20 - 49': UsersRound,
  '50 - 99': Building,
  '100 or more': Building2,
}

export const VEHICLE_TYPE_ICONS: Record<string, LucideIcon> = {
  'Vans or trucks': Truck,
  'Heavy duty or semi trucks': Truck,
  'Cars or limousines': Car,
  Trailers: Package,
  'Construction machinery': HardHat,
  Buses: Bus,
  Other: CircleHelp,
}

export const TEAM_SIZE_ICONS: Record<string, LucideIcon> = {
  '1-5 users': User,
  '6-20 users': Users,
  '21-50 users': UsersRound,
  '51-200 users': Building,
  '200+ users': Building2,
}

export function iconForLabel(label: string, fallback: LucideIcon = CircleHelp): LucideIcon {
  return (
    INDUSTRY_ICONS[label] ||
    FEATURE_ICONS[label] ||
    CRM_EMPLOYEE_ICONS[label] ||
    EMPLOYEE_COUNT_ICONS[label] ||
    PAYROLL_SOLUTION_ICONS[label] ||
    FLEET_SIZE_ICONS[label] ||
    VEHICLE_TYPE_ICONS[label] ||
    TEAM_SIZE_ICONS[label] ||
    fallback
  )
}

export {
  Activity,
  Banknote,
  BarChart3,
  Briefcase,
  Building,
  Building2,
  Bus,
  Calculator,
  CalendarClock,
  Car,
  CheckCircle2,
  CircleHelp,
  Clock,
  Cloud,
  Cpu,
  Eye,
  Factory,
  Filter,
  GraduationCap,
  HardHat,
  Headphones,
  HeartPulse,
  Home,
  Inbox,
  Kanban,
  Keyboard,
  Landmark,
  Layers,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Monitor,
  Package,
  Palette,
  Phone,
  PhoneCall,
  Plug,
  RefreshCw,
  Rocket,
  ScanLine,
  Send,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Store,
  Table,
  Target,
  Timer,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  UsersRound,
  Wallet,
  Wrench,
  XCircle,
  Zap,
}
