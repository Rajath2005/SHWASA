'use client'

import { useEffect, useState } from 'react'

export function PreferencesPanel() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('system')
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('pulmo-theme') || 'system'
    const savedReduced = localStorage.getItem('pulmo-reduced-motion') === 'true'
    setTheme(savedTheme); setReduced(savedReduced)
    document.documentElement.dataset.theme = savedTheme
    document.documentElement.dataset.reducedMotion = String(savedReduced)
    const onStorage = () => {
      const nextTheme = localStorage.getItem('pulmo-theme') || 'system'
      const nextReduced = localStorage.getItem('pulmo-reduced-motion') === 'true'
      setTheme(nextTheme); setReduced(nextReduced)
      document.documentElement.dataset.theme = nextTheme
      document.documentElement.dataset.reducedMotion = String(nextReduced)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateTheme = (value: string) => { setTheme(value); localStorage.setItem('pulmo-theme', value); document.documentElement.dataset.theme = value; document.documentElement.style.colorScheme = value === 'system' ? '' : value }
  const updateMotion = (value: boolean) => { setReduced(value); localStorage.setItem('pulmo-reduced-motion', String(value)); document.documentElement.dataset.reducedMotion = String(value) }

  return <>
    <button className="utility-button" onClick={() => setOpen(true)} aria-label="Open display preferences" title="Display preferences">Aa</button>
    {open && <div className="preferences-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section className="preferences-panel" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
        <div className="preferences-head"><div><span className="tiny-label">INTERFACE SETTINGS</span><h2 id="preferences-title">Tune your reading space</h2></div><button className="preferences-close" onClick={() => setOpen(false)} aria-label="Close preferences">×</button></div>
        <label className="preference-row"><span><b>Theme</b><small>Choose the surface that fits your workflow.</small></span><select value={theme} onChange={event => updateTheme(event.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
        <label className="preference-row"><span><b>Reduced motion</b><small>Keep transitions calm and accessible.</small></span><input type="checkbox" checked={reduced} onChange={event => updateMotion(event.target.checked)} /></label>
        <p className="preferences-foot">Preferences are saved on this device and sync across open tabs.</p>
      </section>
    </div>}
  </>
}

export function ShareButton({ label = 'Share research' }: { label?: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const data = { title: document.title, text: 'SHWASA respiratory acoustic intelligence', url: window.location.href }
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } } catch { /* dismissed */ }
  }
  return <button className="share-button" onClick={share} aria-live="polite">{copied ? 'Link copied' : label} <span aria-hidden="true">↗</span></button>
}
