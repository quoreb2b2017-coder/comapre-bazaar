'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type BuyerZoneSplitProps = {
  form: ReactNode
  panel: ReactNode
}

export function BuyerZoneSplit({ form, panel }: BuyerZoneSplitProps) {
  const formRef = useRef<HTMLDivElement>(null)
  const [rowHeight, setRowHeight] = useState<number | null>(null)

  useEffect(() => {
    const formEl = formRef.current
    if (!formEl) return

    const measure = () => {
      const iframe = formEl.querySelector('iframe')
      const source = iframe || formEl
      const next = Math.ceil(source.getBoundingClientRect().height)
      if (next > 80) setRowHeight(next)
    }

    measure()
    const timers = [200, 600, 1200, 2000].map((ms) => window.setTimeout(measure, ms))

    const observer = new ResizeObserver(measure)
    observer.observe(formEl)
    const iframe = formEl.querySelector('iframe')
    if (iframe) observer.observe(iframe)

    const mutations = new MutationObserver(() => {
      measure()
      const lateIframe = formEl.querySelector('iframe')
      if (lateIframe) observer.observe(lateIframe)
    })
    mutations.observe(formEl, { childList: true, subtree: true })

    window.addEventListener('resize', measure)

    return () => {
      timers.forEach(clearTimeout)
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-8">
      <div ref={formRef} className="bz-quote-widget w-full max-w-[480px] overflow-visible">
        {form}
      </div>
      <div
        className="hidden w-full lg:block"
        style={rowHeight ? { minHeight: rowHeight } : { minHeight: 640 }}
      >
        {panel}
      </div>
      <div className="w-full lg:hidden">{panel}</div>
    </div>
  )
}
