import Link from 'next/link'
import type { HubPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  ClipboardIcon,
  GlobeIcon,
  HandshakeIcon,
  HeadsetIcon,
  MailIcon,
  PhoneIcon,
  TargetIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from '@/components/ui/icons'

interface HubPageTemplateProps {
  data: HubPageData
}

export function HubPageTemplate({ data }: HubPageTemplateProps) {
  const getCardIcon = (icon: string) => {
    const className = 'w-6 h-6 text-[#F27F25]'
    switch (icon) {
      case 'handshake':
        return <HandshakeIcon className={className} />
      case 'mail':
        return <MailIcon className={className} />
      case 'globe':
        return <GlobeIcon className={className} />
      case 'wallet':
        return <WalletIcon className={className} />
      case 'phone':
        return <PhoneIcon className={className} />
      case 'truck':
        return <TruckIcon className={className} />
      case 'users':
        return <UsersIcon className={className} />
      case 'target':
        return <TargetIcon className={className} />
      case 'headset':
        return <HeadsetIcon className={className} />
      case 'clipboard':
        return <ClipboardIcon className={className} />
      default:
        return <ClipboardIcon className={className} />
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-navy-mid py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Breadcrumb
            items={data.breadcrumbs}
            className="mb-5 justify-center [&_a]:text-blue-300 [&_span]:text-white/60"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            {data.h1}
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-xl mx-auto">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">
          Browse all guides
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {data.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
              aria-label={`${card.title} — ${card.meta}`}
            >
              <div className="mb-4" aria-hidden="true">{getCardIcon(card.icon)}</div>
              <h3 className="font-semibold text-navy mb-2 group-hover:text-brand transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{card.meta}</span>
                <span className="text-sm text-brand font-semibold">Compare →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
