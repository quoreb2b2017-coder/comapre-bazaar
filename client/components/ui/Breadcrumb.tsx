import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  tone?: 'default' | 'onDark'
}

export function Breadcrumb({ items, className = '', tone = 'default' }: BreadcrumbProps) {
  const onDark = tone === 'onDark'

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-sm ${
          onDark ? 'text-white/80' : 'text-gray-400'
        }`}
      >
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link
                href={item.href}
                className={
                  onDark
                    ? 'font-medium text-white hover:text-cb-orange-light hover:underline'
                    : 'text-brand hover:underline'
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={onDark ? 'font-medium text-white/90' : 'text-gray-500'}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
