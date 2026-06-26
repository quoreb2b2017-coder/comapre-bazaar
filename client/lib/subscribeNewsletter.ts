export const SUBSCRIBE_EMAIL_KEY = 'cb_subscribed_email'
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeNewsletter(email: string, sourceSlug: string) {
  const value = email.trim().toLowerCase()
  if (!EMAIL_RE.test(value)) {
    throw new Error('Please enter a valid email address.')
  }

  const res = await fetch('/api/v1/blog-admin/public/blogs/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: value, sourceSlug }),
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Subscribe failed')
  }
  return data as { success: boolean; message?: string }
}
