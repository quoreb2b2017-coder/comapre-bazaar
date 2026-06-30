const TOPIC_COPY: Record<string, string> = {
  'CRM Software':
    'Selection criteria, vendor shortlists, and implementation notes for CRM platforms — written for sales and ops leaders.',
  'Payroll Software':
    'Payroll vendor comparisons, compliance considerations, and rollout guidance for HR and finance teams.',
  'GPS Fleet Management':
    'Fleet tracking evaluations, feature checklists, and TCO frameworks for operations and logistics teams.',
  'Cloud Call Center':
    'Contact center platform guides covering routing, integrations, and agent experience for support leaders.',
  'AI Agents':
    'How autonomous AI agents compare to traditional software — evaluation frameworks for automation buyers.',
  VoIP: 'Business VoIP comparisons, call quality factors, and migration checklists for IT and telecom buyers.',
}

export function topicIntro(label: string): string {
  return (
    TOPIC_COPY[label] ??
    `Independent buying guides and vendor comparisons for ${label} — structured research with clear trade-offs.`
  )
}
