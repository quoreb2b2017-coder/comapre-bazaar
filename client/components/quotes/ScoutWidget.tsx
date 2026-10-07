'use client'

import { useEffect, useRef } from 'react'

type ScoutWidgetOptions = {
  id: string
  sourceId: string
  isTest?: boolean
  test?: boolean
}

declare global {
  interface Window {
    scoutWidget?: {
      Initialize: (element: HTMLElement, options: ScoutWidgetOptions) => unknown
      Destroy: (element: HTMLElement) => void
    }
  }
}

type ScoutWidgetProps = {
  embedId: string
  sourceId?: string
}

const SCOUT_SRC = 'https://d1bhoz8vz21659.cloudfront.net/scout-widget.js'
const DEFAULT_SOURCE_ID = '14588'
// Leads are flagged as test everywhere except production builds.
const IS_TEST = process.env.NODE_ENV !== 'production'

let scoutReady: Promise<void> | null = null

function loadScout(): Promise<void> {
  if (window.scoutWidget) return Promise.resolve()
  if (scoutReady) return scoutReady

  scoutReady = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCOUT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SCOUT_SRC
      script.type = 'module'
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => {
        scoutReady = null
        reject(new Error('Scout widget script failed to load'))
      },
      { once: true },
    )
  })
  return scoutReady
}

export function ScoutWidget({ embedId, sourceId = DEFAULT_SOURCE_ID }: ScoutWidgetProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const host = document.createElement('div')
    host.className = 'w-full'
    mount.replaceChildren(host)
    let cancelled = false

    loadScout()
      .then(() => {
        if (cancelled || !window.scoutWidget) return
        window.scoutWidget.Initialize(host, {
          id: embedId,
          sourceId,
          isTest: IS_TEST,
          test: IS_TEST,
        })
      })
      .catch((err) => console.error(err))

    return () => {
      cancelled = true
      if (host.getAttribute('data-initialized') === 'true') {
        window.scoutWidget?.Destroy(host)
      }
      host.remove()
    }
  }, [embedId, sourceId])

  return <div ref={mountRef} className="scout-widget-mount w-full" />
}
