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
      <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-[#123d92] py-16 px-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(245,130,32,0.15),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Breadcrumb
            items={data.breadcrumbs}
            className="mb-5 justify-center [&_a]:text-blue-300 [&_span]:text-white/60"
          />
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">{data.subtitle}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cb-orange">Browse all guides</p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cb-orange/30 hover:shadow-lg hover:shadow-navy/5"
              aria-label={`${card.title}. ${card.meta}`}
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
