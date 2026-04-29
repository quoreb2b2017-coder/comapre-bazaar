import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="font-serif text-8xl text-brand mb-4">404</p>
      <h1 className="text-2xl font-semibold text-navy mb-3">Page not found</h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-hover transition-colors"
      >
        Back to homepage
      </Link>
    </div>
  )
}
