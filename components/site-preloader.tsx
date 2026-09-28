'use client'

import { useEffect, useState } from 'react'

export function SitePreloader() {
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reducedMotion === 'true'
    const hasVisited = sessionStorage.getItem('shwasa-preloader-seen') === 'true'

    if (hasVisited || reduced) {
      setVisible(false)
      return
    }

    const revealTimer = window.setTimeout(() => setReady(true), 620)
    const closeTimer = window.setTimeout(() => {
      sessionStorage.setItem('shwasa-preloader-seen', 'true')
      setVisible(false)
    }, 1120)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(closeTimer)
    }
  }, [])

  if (!visible) return null

  return <div className={`site-preloader${ready ? ' is-ready' : ''}`} role="status" aria-live="polite" aria-label="Loading SHWASA research interface">
    <div className="preloader-shell">
      <div className="preloader-brand"><span className="preloader-mark"><i /><i /><i /></span><span>SHWASA</span></div>
      <div className="preloader-signal" aria-hidden="true">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ '--preloader-height': `${16 + ((index * 31) % 70)}%`, '--preloader-delay': `${index * -38}ms` } as React.CSSProperties} />)}</div>
      <div className="preloader-meta"><span>{ready ? 'SIGNAL READY' : 'CALIBRATING SIGNAL'}</span><b>{ready ? '100%' : '042%'}</b></div>
    </div>
  </div>
}
