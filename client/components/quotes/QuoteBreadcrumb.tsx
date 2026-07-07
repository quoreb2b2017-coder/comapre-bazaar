import Link from "next/link";

export type QuoteBreadcrumbItem = {
  label: string;
  href?: string;
};

type QuoteBreadcrumbProps = {
  items: QuoteBreadcrumbItem[];
};

export function QuoteBreadcrumb({ items }: QuoteBreadcrumbProps) {
  return (
    <div className="bc">
      <div className="ct">
        <nav className="bc-row" aria-label="Breadcrumb">
          {items.map((item, index) => (
            <span key={`${item.label}-${index}`} className="bc-item">
              {index > 0 ? <span className="bc-sep" aria-hidden>›</span> : null}
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span className="bc-cur">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
