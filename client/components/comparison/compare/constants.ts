export const MAX_COMPARE = 4

export const WORKS_BEST_FOR_BY_PRODUCT: Record<string, string[]> = {
  hubspot: [
    'Small to mid-market businesses',
    'Marketing and sales teams needing one shared CRM',
    'Inbound lead-generation focused B2B companies',
    'Teams prioritizing fast onboarding and ease of use',
    'Organizations starting with free CRM and scaling later',
  ],
  zoho: [
    'Budget-conscious SMBs and growing businesses',
    'Teams needing multichannel sales outreach',
    'Businesses wanting strong CRM customization',
    'Sales teams that rely on automation and lead scoring',
    'Companies adopting an all-in-one business software stack',
  ],
  'creatio-crm': [
    'Workflow-heavy organizations with complex sales processes',
    'Enterprises needing no-code CRM customization',
    'Teams combining CRM with process automation',
    'Businesses replacing fragmented legacy tools',
    'Organizations with industry-specific workflow requirements',
  ],
  'honeybook-crm': [
    'Freelancers and service-based professionals',
    'Agencies handling proposals, contracts, and invoices',
    'Small client-service teams wanting one workflow platform',
    'Businesses focused on polished client booking experience',
    'Users needing simple automation without heavy setup',
  ],
  'pipedrive-crm': [
    'Sales-first teams focused on pipeline execution',
    'SMB sales orgs needing visual deal tracking',
    'Teams that want quick implementation and adoption',
    'Reps working with activity-based follow-up workflows',
    'Businesses prioritizing deal velocity over broad marketing tools',
  ],
  'salesforce-crm': [
    'Large enterprises with complex multi-stage deals',
    'Organizations needing deep customization and governance',
    'Teams requiring advanced forecasting and territory planning',
    'Businesses with dedicated CRM admin/ops resources',
    'Companies depending on broad enterprise integrations',
  ],
}
