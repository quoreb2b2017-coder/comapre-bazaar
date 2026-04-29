import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps: IconProps = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HandshakeIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M11 6 8 9a2.5 2.5 0 0 0 3.5 3.5L14 10l2 2" />
      <path d="m3 10 3-3 5 5-3 3z" />
      <path d="m13 8 3-3 5 5-3 3z" />
      <path d="m6 13 3 3" />
      <path d="m9 16 2.5 2.5a2 2 0 0 0 2.8 0l1.7-1.7a2 2 0 0 0 0-2.8L14 12" />
    </svg>
  )
}

export function WalletIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M16 12h6v4h-6a2 2 0 1 1 0-4Z" />
      <path d="M6 10h7" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.59 2.6a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.26-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.6.59A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M8 4h8v3a4 4 0 0 1-8 0Z" />
      <path d="M16 5h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 5H6a2 2 0 0 0 0 4h2" />
      <path d="M12 11v4" />
      <path d="M9 21h6" />
      <path d="M10 15h4a2 2 0 0 1 2 2v1H8v-1a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M1 3h15v11H1z" />
      <path d="M16 8h4l3 3v3h-7z" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  )
}

export function TargetIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  )
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M4 12a8 8 0 0 1 16 0" />
      <rect x="2" y="12" width="4" height="6" rx="2" />
      <rect x="18" y="12" width="4" height="6" rx="2" />
      <path d="M6 18a6 6 0 0 0 12 0" />
    </svg>
  )
}

export function KeyboardIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8" />
    </svg>
  )
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M12 3a9 9 0 0 0 0 18h1a2.5 2.5 0 0 0 0-5h-1a2.5 2.5 0 0 1 0-5h5.5A3.5 3.5 0 0 0 21 7.5 4.5 4.5 0 0 0 16.5 3H12Z" />
      <circle cx="7.5" cy="9" r="1" />
      <circle cx="10" cy="6.5" r="1" />
      <circle cx="13.5" cy="6.5" r="1" />
    </svg>
  )
}

export function TextIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M4 6h16" />
      <path d="M12 6v12" />
      <path d="M8 18h8" />
    </svg>
  )
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  )
}

export function FilmIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 8h4M17 8h4M3 16h4M17 16h4" />
    </svg>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" />
    </svg>
  )
}
