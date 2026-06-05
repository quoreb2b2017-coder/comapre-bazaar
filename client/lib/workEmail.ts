const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'yandex.com',
  'ymail.com',
  'rediffmail.com',
  'qq.com',
  '163.com',
  '126.com',
])

export function isWorkEmail(email: string): boolean {
  const raw = String(email || '').trim().toLowerCase()
  const domain = raw.split('@')[1]
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

export const WORK_EMAIL_ERROR =
  'Please use your work email (company domain). Personal emails like Gmail or Yahoo are not accepted.'
