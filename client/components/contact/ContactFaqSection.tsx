import { CONTACT_FAQS } from '@/data/contactFaqs'

/** Server-rendered FAQ — always present in initial HTML for crawlers and no-JS clients. */
export function ContactFaqSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-[#000e54] mb-8">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {CONTACT_FAQS.map((faq, idx) => (
          <details
            key={faq.question}
            open={idx === 0}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary className="w-full px-5 py-4 text-left font-semibold text-[#000e54] flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span className="text-xl leading-none group-open:hidden">+</span>
              <span className="text-xl leading-none hidden group-open:inline">−</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed space-y-2">
              {Array.isArray(faq.answer)
                ? faq.answer.map((line) => <p key={line}>{line}</p>)
                : <p>{faq.answer}</p>}
              {faq.answerDetails?.map((line) => <p key={line}>{line}</p>)}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
