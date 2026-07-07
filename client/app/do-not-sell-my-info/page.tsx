import { redirect } from 'next/navigation'

export default function DoNotSellMyInfoRedirectPage() {
  redirect('/privacy-policy/ccpa-opt-out')
}
