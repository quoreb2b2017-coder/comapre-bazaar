import { redirect } from 'next/navigation'

export default function DoNotSellRedirectPage() {
  redirect('/privacy-policy/ccpa-opt-out')
}
