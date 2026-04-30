'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoIcon from '../icon.png'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  chips?: Chip[]
  time: string
}

interface Chip {
  label: string
  href?: string
  action?: string
}

const QUICK_TOPICS = [
  { label: 'GPS Fleet', q: 'What is GPS fleet management software?' },
  { label: 'Payroll', q: "What's the best payroll software for small business?" },
  { label: 'CRM', q: 'Which CRM is best for a small sales team?' },
  { label: 'Email Marketing', q: 'What email marketing tool should I use?' },
  { label: 'HR Software', q: "What's the best employee management software?" },
  { label: 'VoIP', q: "What's the best business phone system?" },
  { label: 'Project Mgmt', q: 'Best project management software for teams?' },
  { label: 'Pricing', q: 'How much does business software cost?' },
]

function detectChips(userMsg: string, botReply: string): Chip[] {
  const combined = `${userMsg} ${botReply}`.toLowerCase()

  if (combined.match(/fleet|gps|vehicle|tracking|samsara/))
    return [
      { label: 'Get Fleet Quotes ->', href: '/technology/gps-fleet-management-software/get-free-quotes' },
      { label: 'Compare Fleet Software', href: '/technology/gps-fleet-management-software' },
    ]
  if (combined.match(/payroll|gusto|adp|onpay/))
    return [
      { label: 'Get Payroll Quotes ->', href: '/human-resources/best-payroll-software/get-free-quotes' },
      { label: 'Compare Payroll Software', href: '/human-resources/best-payroll-software' },
    ]
  if (combined.match(/crm|hubspot|salesforce|pipedrive|pipeline/))
    return [
      { label: 'Get CRM Quotes ->', href: '/marketing/best-crm-software/get-free-quote' },
      { label: 'Compare CRM Software', href: '/marketing/best-crm-software' },
    ]
  if (combined.match(/email marketing|mailchimp|klaviyo|activecampaign/))
    return [
      { label: 'Get Email Quotes ->', href: '/marketing/best-email-marketing-services/get-free-quotes' },
      { label: 'Compare Email Tools', href: '/marketing/best-email-marketing-services' },
    ]
  if (combined.match(/employee|hr software|bamboohr|rippling|workday|onboarding/))
    return [
      { label: 'Get HR Software Quotes ->', href: '/human-resources/best-employee-management-software/get-free-quotes' },
      { label: 'Compare HR Software', href: '/human-resources/best-employee-management-software' },
    ]
  if (combined.match(/phone|voip|ringcentral|nextiva|ooma/))
    return [
      { label: 'Get Phone Quotes ->', href: '/technology/business-phone-systems/get-free-quotes' },
      { label: 'Compare Phone Systems', href: '/technology/business-phone-systems' },
    ]
  if (combined.match(/project|monday|clickup|asana|jira|task management/))
    return [
      { label: 'Get PM Quotes ->', href: '/sales/best-project-management-software/get-free-quotes' },
      { label: 'Compare PM Tools', href: '/sales/best-project-management-software' },
    ]
  if (combined.match(/website builder|wix|squarespace|shopify|webflow/))
    return [
      { label: 'Get Website Quotes ->', href: '/marketing/best-website-building-platform/get-free-quotes' },
      { label: 'Compare Website Builders', href: '/marketing/best-website-building-platform' },
    ]
  if (combined.match(/contact|support|help|email us|call/))
    return [
      { label: 'Email Support', href: 'mailto:marketing@compare-bazaar.com' },
      { label: 'Call Us', href: 'tel:+13322310404' },
    ]
  if (combined.match(/price|cost|how much|pricing|budget/))
    return [
      { label: 'Get Free Quotes', href: '/technology/get-free-quotes' },
      { label: 'Browse All Software', href: '/browse-all-software' },
    ]
  return [{ label: 'Browse All Software ->', href: '/browse-all-software' }]
}

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

let msgCounter = 0
const uid = () => `msg-${++msgCounter}`

export function CompareBazaarChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: 'bot',
      text: "Hi! I'm the Compare Bazaar assistant. I can help you find and compare the best business software. What are you looking for today?",
      chips: [
        { label: 'Get Free Quotes', href: '/technology/get-free-quotes' },
        { label: 'Browse All Software', href: '/browse-all-software' },
      ],
      time: getTime(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ role: string; content: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim()
      if (!msg || loading) return

      setInput('')
      const userMsg: Message = { id: uid(), role: 'user', text: msg, time: getTime() }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      const newHistory = [...history, { role: 'user', content: msg }]

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newHistory }),
        })

        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        const reply: string = data.reply ?? 'Sorry, I could not get a response. Please try again.'

        setHistory([...newHistory, { role: 'assistant', content: reply }])
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: 'bot', text: reply, chips: detectChips(msg, reply), time: getTime() },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'bot',
            text: 'Sorry, something went wrong. Please try again or contact us at marketing@compare-bazaar.com.',
            chips: [{ label: 'Email Support', href: 'mailto:marketing@compare-bazaar.com' }],
            time: getTime(),
          },
        ])
      }

      setLoading(false)
    },
    [input, loading, history]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const unreadCount = open ? 0 : messages.filter((m) => m.role === 'bot').length - 1

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#F78230] to-[#D96A08] text-white shadow-2xl flex items-center justify-center hover:brightness-105 hover:scale-[1.03] transition-all"
        aria-label={open ? 'Close chat' : 'Open Compare Bazaar chat assistant'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FCE7D0] text-[#9C4302] text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[350px] sm:w-[390px] bg-white rounded-2xl shadow-2xl border border-[#F4D4B5] flex flex-col overflow-hidden"
          style={{ height: 'min(500px, calc(100vh - 170px))' }}
          role="dialog"
          aria-label="Compare Bazaar chat assistant"
          aria-modal="true"
        >
          <div className="bg-gradient-to-r from-[#F78230] to-[#D96A08] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#FCE7D0] flex items-center justify-center flex-shrink-0 overflow-hidden" aria-hidden="true">
              <Image src={logoIcon} alt="" width={28} height={28} className="w-7 h-7 object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-none">Compare Bazaar Assistant</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" aria-hidden="true" />
                <span className="text-white/75 text-[11px]">Online now</span>
              </div>
            </div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full">AI</span>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full border border-white/40 text-white hover:bg-white/15 transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-3 py-2 border-b border-[#F8E4CF] bg-[#FFF8F2] overflow-hidden flex-shrink-0">
            <div className="flex gap-1.5 min-w-max cb-topic-marquee" style={{ animation: 'cb-marquee 24s linear infinite' }}>
              {[...QUICK_TOPICS, ...QUICK_TOPICS].map(({ label, q }, index) => (
                <button
                  key={`${label}-${index}`}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] font-medium text-[#9C4302] border border-[#F3C69A] bg-white px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#FFF2E7] transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#FCE7D0] flex items-center justify-center flex-shrink-0 overflow-hidden" aria-hidden="true">
                    <Image src={logoIcon} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[82%]">
                  <div
                    className={`px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#F27F25] text-white rounded-br-sm'
                        : 'bg-[#FFF8F2] text-[#3A2A1A] border border-[#F4D4B5] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.chips.map((chip) =>
                          chip.href ? (
                            <Link
                              key={chip.label}
                              href={chip.href}
                              target={
                                chip.href.startsWith('http') || chip.href.startsWith('mailto') || chip.href.startsWith('tel')
                                  ? '_blank'
                                  : undefined
                              }
                              rel="noopener"
                              className="bg-[#F27F25] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#D96A08] transition-colors"
                            >
                              {chip.label}
                            </Link>
                          ) : (
                            <button
                              key={chip.label}
                              onClick={() => chip.action && sendMessage(chip.action)}
                              className="bg-[#F27F25] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#D96A08] transition-colors"
                            >
                              {chip.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] text-gray-400 px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</span>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#F27F25] text-white flex items-center justify-center text-xs flex-shrink-0" aria-hidden="true">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-[#FCE7D0] flex items-center justify-center flex-shrink-0 overflow-hidden" aria-hidden="true">
                  <Image src={logoIcon} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
                </div>
                <div className="bg-[#FFF8F2] border border-[#F4D4B5] px-3 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#E2A774] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#F4D4B5] px-3 py-2.5 flex items-end gap-2 flex-shrink-0 bg-white">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about CRM, payroll, VoIP..."
              rows={1}
              className="flex-1 resize-none border border-[#F2C79F] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[#F27F25] focus:ring-2 focus:ring-[#FCE7D0] transition-all max-h-24 text-gray-800 placeholder-gray-400"
              aria-label="Chat input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-[#F27F25] hover:bg-[#D96A08] disabled:bg-gray-200 text-white flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes cb-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .cb-topic-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  )
}
