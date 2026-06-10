export type ContactFaq = {
  question: string
  answer: string | string[]
  answerDetails?: string[]
}

export const CONTACT_FAQS: ContactFaq[] = [
  {
    question: 'How can I contact Compare Bazaar customer support?',
    answer: [
      'You can reach us through:',
      '• Phone: +1 332-231-0404 (Monday–Friday 9am–11pm, Sunday 9am–4pm)',
      '• Email: contactus@compare-bazaar.com',
      '• In-person: 539 W. Commerce St #2577, Dallas, TX 75208',
      '• Contact form: Use the form on this page and we will reply within 1 business day',
      '• LinkedIn: https://www.linkedin.com/company/comparebazaar/posts/?feedView=all',
    ],
  },
  {
    question: 'What are your customer support hours?',
    answer: [
      'Our support team is available:',
      'Monday–Friday: 9:00 AM to 11:00 PM',
      'Sunday: 9:00 AM to 4:00 PM',
    ],
  },
  {
    question: 'How long does it take to get a response from your team?',
    answer: 'We typically respond within:',
    answerDetails: [
      '• Email: Within 2 business hours',
      '• Phone: During posted business hours',
      'For complex inquiries, resolution may take 24-48 hours',
    ],
  },
  {
    question: 'Do you have international contact numbers?',
    answer: [
      'Yes! We serve customers globally with regional support coverage:',
      '• UK support',
      '• UAE support',
      '• India support',
      '• Australia support',
      "Full list available on our 'Contact Us' page",
    ],
  },
  {
    question: 'Can I schedule a callback from your team?',
    answer:
      "Absolutely! Use our 'Request Callback' form on the contact page to select your preferred time and we'll call you back at your convenience.",
  },
  {
    question: 'Where can I send partnership or business inquiries?',
    answer:
      'For business collaborations, please email contactus@compare-bazaar.com or fill out the partnership form on this page. Our business development team responds within 24 hours.',
  },
  {
    question: 'How do I report a technical issue with the website?',
    answer: [
      'Please report any technical problems to:',
      '• Email: contactus@compare-bazaar.com',
      '• Phone support: Request a technical callback through our support form',
      "• Use the 'Report Issue' button in your account dashboard",
      'Include screenshots and details for faster resolution',
    ],
  },
  {
    question: 'What information should I include when contacting support?',
    answer: [
      'For faster service, please provide:',
      '• Your account email/username',
      '• Relevant order/transaction IDs',
      '• Detailed description of your inquiry',
      '• Screenshots if applicable',
      '• Preferred contact method',
    ],
  },
  {
    question: 'Do you have a premium support option?',
    answer:
      'Yes, Compare Bazaar members get priority support with dedicated account managers, extended phone hours, and faster response times for all inquiries.',
  },
  {
    question: 'How can I provide feedback about your service?',
    answer: [
      'We welcome your feedback through:',
      '• Customer satisfaction surveys after each interaction',
      '• Email to contactus@compare-bazaar.com',
      '• Review platforms like Trustpilot',
      'All feedback receives a personal response from our management team',
    ],
  },
]
