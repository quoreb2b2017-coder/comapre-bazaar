'use client'

import { useEffect, useId, useRef, useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listboxId = useId()

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

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1)
      return
    }
    const selectedIndex = options.findIndex((opt) => opt === value)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, options, value])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    const item = listRef.current?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const selectOption = (opt: string) => {
    onChange(opt)
    setOpen(false)
  }

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (!options.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      selectOption(options[activeIndex])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className={`flex h-10 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3.5 text-left text-[13px] transition-all duration-200 ${
          open
            ? 'border-[#1D4ED8]/40 shadow-[0_0_0_3px_rgba(29,78,216,0.08)]'
            : 'border-gray-200 shadow-[0_1px_2px_rgba(15,31,61,0.04)] hover:border-gray-300'
        } ${value ? 'font-medium text-navy' : 'font-normal text-gray-400'}`}
      >
        <span className="min-w-0 truncate leading-snug">{value || placeholder}</span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
            open ? 'bg-[#EEF2FF] text-[#1D4ED8]' : 'bg-gray-50 text-gray-400'
          }`}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </motion.span>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-40 mt-2 w-full"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-[0_18px_48px_-20px_rgba(15,31,61,0.28)] ring-1 ring-black/[0.03]">
              <div className="border-b border-gray-100 bg-[#FAFBFD] px-3.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Choose one option
                </p>
              </div>
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={id}
                onKeyDown={onListKeyDown}
                tabIndex={-1}
                className="max-h-56 overflow-auto py-1.5"
              >
                {options.map((opt, index) => {
                  const selected = value === opt
                  const active = activeIndex === index
                  return (
                    <li key={`${opt}-${index}`} role="presentation">
                      <button
                        type="button"
                        role="option"
                        data-option-index={index}
                        aria-selected={selected}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectOption(opt)}
                        className={`mx-1.5 flex w-[calc(100%-0.75rem)] items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                          selected
                            ? 'bg-[#EEF2FF] font-semibold text-[#1D4ED8]'
                            : active
                              ? 'bg-gray-50 text-navy'
                              : 'text-gray-700'
                        }`}
                      >
                        <span className="min-w-0 leading-snug">{opt}</span>
                        {selected ? (
                          <Check className="h-4 w-4 shrink-0 text-[#1D4ED8]" strokeWidth={2.25} aria-hidden />
                        ) : (
                          <span className="h-4 w-4 shrink-0" aria-hidden />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
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
