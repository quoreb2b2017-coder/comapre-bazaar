'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    bzWidget?: { init: () => void }
  }
}

type BuyerZoneWidgetProps = {
  categoryId: string
  pubId?: string
}

const WIDGET_SRC = 'https://cdn.buyerzone.com/apps/widget/bzWidget.min.js'
const WIDGET_HEIGHT = '625px'

function unlockWidgetBox(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.bzWidget').forEach((box) => {
    box.style.setProperty('height', WIDGET_HEIGHT, 'important')
    box.style.setProperty('min-height', WIDGET_HEIGHT, 'important')
    box.style.setProperty('overflow', 'visible', 'important')
    box.style.setProperty('max-width', '100%', 'important')
    box.style.setProperty('box-shadow', 'none', 'important')
    box.style.setProperty('background', 'transparent', 'important')

    const iframe = box.querySelector('iframe')
    if (iframe) {
      iframe.style.setProperty('height', WIDGET_HEIGHT, 'important')
      iframe.style.setProperty('min-height', WIDGET_HEIGHT, 'important')
      iframe.setAttribute('height', '625')
    }
  })
}

export function BuyerZoneWidget({ categoryId, pubId = '59578' }: BuyerZoneWidgetProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    mount.replaceChildren()

    const script = document.createElement('script')
    script.src = WIDGET_SRC
    script.async = true
    script.setAttribute('data-bzwidget', '')
    script.setAttribute('data-bzwidget-pub-id', pubId)
    script.setAttribute('data-bzwidget-color-palette-name', 'default')
    script.setAttribute('data-bzwidget-category-id', categoryId)
    script.setAttribute('data-bzwidget-hide-border', '')
    script.setAttribute('data-bzwidget-lazy-load', 'false')

    const reveal = () => {
      window.bzWidget?.init()
      unlockWidgetBox(mount)
    }

    script.onload = reveal
    mount.appendChild(script)

    const observer = new MutationObserver(() => unlockWidgetBox(mount))
    observer.observe(mount, { childList: true, subtree: true })

    const timers = [300, 800, 1600].map((ms) => window.setTimeout(() => unlockWidgetBox(mount), ms))

    return () => {
      script.onload = null
      script.remove()
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [categoryId, pubId])

  return <div ref={mountRef} className="bz-widget-mount w-full" />
}
