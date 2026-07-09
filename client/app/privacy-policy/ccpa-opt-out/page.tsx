import { redirect } from 'next/navigation'

export default function CcpaOptOutRedirectPage() {
  redirect('/do-not-sell')
}
