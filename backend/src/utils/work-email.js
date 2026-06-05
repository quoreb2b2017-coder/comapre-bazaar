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

function emailDomain(email) {
  const parts = String(email || '')
    .toLowerCase()
    .trim()
    .split('@')
  return parts.length === 2 ? parts[1] : ''
}

function isWorkEmail(email) {
  const domain = emailDomain(email)
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

module.exports = { isWorkEmail, emailDomain, PERSONAL_EMAIL_DOMAINS }
