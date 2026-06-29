'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

type Props = {
  id?: string
  value: string
  options: string[]
  placeholder?: string
  required?: boolean
  onChange: (value: string) => void
}

export function WhitePaperCustomSelect({
  id,
  value,
  options,
  placeholder = 'Select an option',
  required = false,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-[13px] shadow-[0_1px_2px_rgba(15,31,61,0.04)] transition-all duration-200 ease-out ${
          open
            ? 'border-cb-orange ring-2 ring-cb-orange/15'
            : 'border-gray-200 hover:border-gray-300'
        } ${value ? 'font-medium text-navy' : 'text-gray-400'}`}
      >
        <span className="min-w-0 truncate">{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-gray-400"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-30 mt-1.5 w-full origin-top"
          >
            <ul
              role="listbox"
              aria-labelledby={id}
              className="max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-[0_14px_32px_-12px_rgba(15,31,61,0.22)]"
            >
              {options.map((opt, index) => {
                const selected = value === opt
                return (
                  <li key={opt} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onChange(opt)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors duration-150 ${
                        selected
                          ? 'bg-[#fff7ef] font-semibold text-cb-orange'
                          : 'text-navy hover:bg-gray-50'
                      }`}
                      style={{ transitionDelay: open ? `${index * 18}ms` : '0ms' }}
                    >
                      <span className="min-w-0 truncate">{opt}</span>
                      {selected ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {required ? (
        <input
          tabIndex={-1}
          aria-hidden
          value={value}
          required
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      ) : null}
    </div>
  )
}
