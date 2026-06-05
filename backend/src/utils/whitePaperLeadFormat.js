function formatCompanyAddress(lead) {
  const parts = [
    lead.companyStreet,
    lead.companySuite,
    [lead.companyCity, lead.companyState].filter(Boolean).join(', '),
    lead.companyPostal,
    lead.companyCountry,
  ].filter((p) => String(p || '').trim())
  return parts.join(' · ') || ''
}

function pickDisplayTitle(paper, slug) {
  const seo = String(paper?.seoTitle || '').trim()
  const raw = String(paper?.title || '').trim()
  if (seo) return seo
  if (raw && raw.length <= 120) return raw
  if (raw) return `${raw.slice(0, 117).replace(/\s+\S*$/, '').trim()}…`
  return slug || '—'
}

function formatLeadForAdmin(lead, paper) {
  const slug = lead.slug || paper?.slug || ''
  const title = pickDisplayTitle(paper, slug)
  return {
    _id: lead._id,
    whitePaperId: lead.whitePaperId,
    whitePaperTitle: title,
    whitePaperSlug: slug,
    whitePaperUrl: slug ? `/resources/whitepaper/${slug}` : '',
    email: lead.email || '',
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    fullName: [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim(),
    jobTitle: lead.jobTitle || '',
    workPhone: lead.workPhone || '',
    companyStreet: lead.companyStreet || '',
    companySuite: lead.companySuite || '',
    companyPostal: lead.companyPostal || '',
    companyCity: lead.companyCity || '',
    companyState: lead.companyState || '',
    companyCountry: lead.companyCountry || '',
    companyAddress: formatCompanyAddress(lead),
    customAnswers: Array.isArray(lead.customAnswers)
      ? lead.customAnswers
          .filter((a) => a && (a.question || a.answer))
          .map((a) => ({
            question: String(a.question || '').trim(),
            answer: String(a.answer || '').trim(),
          }))
      : [],
    customAnswersSummary: Array.isArray(lead.customAnswers)
      ? lead.customAnswers
          .filter((a) => a && (a.question || a.answer))
          .map((a) => `${String(a.question || '').trim()}: ${String(a.answer || '').trim()}`)
          .join(' · ')
      : '',
    marketingConsent: !!lead.marketingConsent,
    profileCompleted: !!lead.profileCompleted,
    downloadedAt: lead.downloadedAt || null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }
}

module.exports = { formatLeadForAdmin, formatCompanyAddress }
