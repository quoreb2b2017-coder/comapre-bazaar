export async function sendFormData(formData, subject = 'Form Submission', captchaToken = '') {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    throw new Error('Web3Forms access key is missing.')
  }

  const payload = {
    access_key: accessKey,
    subject,
    ...formData,
    ...(captchaToken ? { 'g-recaptcha-response': captchaToken } : {}),
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Form request failed with status ${response.status}`)
  }

  return response.json()
}
