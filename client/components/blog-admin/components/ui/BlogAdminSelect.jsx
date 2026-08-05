import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

export function BlogAdminSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  required = false,
  searchable = false,
  searchPlaceholder = 'Search…',
  emptyLabel = 'No matches',
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const searchRef = useRef(null)
  const listboxId = useId()

  const selected = options.find((opt) => opt.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((opt) => {
      const hay = [opt.label, opt.hint, opt.group].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [options, query])

  const grouped = useMemo(() => {
    const hasGroups = filtered.some((opt) => opt.group)
    if (!hasGroups) return [{ group: null, items: filtered }]
    const map = new Map()
    for (const opt of filtered) {
      const key = opt.group || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(opt)
    }
    return Array.from(map.entries()).map(([group, items]) => ({ group, items }))
  }, [filtered])

  const flatFiltered = useMemo(
    () => grouped.flatMap((section) => section.items),
    [grouped]
  )

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
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
    const idx = flatFiltered.findIndex((opt) => opt.value === value)
    setActiveIndex(idx >= 0 ? idx : 0)
    if (searchable) {
      window.setTimeout(() => searchRef.current?.focus(), 0)
    }
  }, [open, flatFiltered, value, searchable])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    listRef.current
      ?.querySelector(`[data-option-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const selectOption = (opt) => {
    onChange(opt.value)
    setOpen(false)
    setQuery('')
  }

  const onTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (event) => {
    if (!flatFiltered.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % flatFiltered.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? flatFiltered.length - 1 : prev - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      selectOption(flatFiltered[activeIndex])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setQuery('')
    }
  }

  let optionCounter = -1

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
        className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
          open
            ? 'border-brand bg-white shadow-[0_0_0_3px_rgba(255,134,51,0.12)] dark:bg-gray-800'
            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
        }`}
      >
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block truncate font-medium text-gray-900 dark:text-gray-100">{selected.label}</span>
              {selected.hint ? (
                <span className="mt-0.5 block truncate text-[11px] font-normal text-gray-500 dark:text-gray-400">
                  {selected.hint}
                </span>
              ) : null}
            </>
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
            open ? 'bg-brand/10 text-brand' : 'bg-gray-50 text-gray-400 dark:bg-gray-700/60 dark:text-gray-400'
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            {searchable ? (
              <div className="border-b border-gray-100 p-2 dark:border-gray-800">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActiveIndex(0)
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
            ) : null}

            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={id}
              onKeyDown={onListKeyDown}
              tabIndex={-1}
              className="max-h-64 overflow-auto py-1.5"
            >
              {flatFiltered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{emptyLabel}</li>
              ) : (
                grouped.map((section) => (
                  <li key={section.group || 'default'} role="presentation">
                    {section.group ? (
                      <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                        {section.group}
                      </p>
                    ) : null}
                    <ul role="presentation">
                      {section.items.map((opt) => {
                        optionCounter += 1
                        const index = optionCounter
                        const isSelected = value === opt.value
                        const isActive = activeIndex === index
                        return (
                          <li key={opt.value} role="presentation">
                            <button
                              type="button"
                              role="option"
                              data-option-index={index}
                              aria-selected={isSelected}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => selectOption(opt)}
                              className={`mx-1.5 flex w-[calc(100%-0.75rem)] items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                isSelected
                                  ? 'bg-brand/10 text-brand'
                                  : isActive
                                    ? 'bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                                    : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span className="min-w-0">
                                <span className={`block text-sm leading-snug ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                  {opt.label}
                                </span>
                                {opt.hint ? (
                                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                                    {opt.hint}
                                  </span>
                                ) : null}
                              </span>
                              {isSelected ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.25} aria-hidden />
                              ) : (
                                <span className="h-4 w-4 shrink-0" aria-hidden />
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}

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
