'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CommandPalette } from './command-palette'
import { PreferencesPanel, ShareButton } from './preferences-panel'

const groups = [
  { label: 'Research', items: [['Approach', '/#approach'], ['Pipeline', '/#pipeline'], ['Results', '/#results']] },
  { label: 'Models', items: [['Models', '/models'], ['Evaluation', '/evaluation']] },
  { label: 'Explore', items: [['Dataset', '/dataset'], ['Playground', '/playground']] },
  { label: 'Resources', items: [['Code', '/code'], ['Docs', '/docs']] },
] as const

export function PremiumNav({ home = false }: { home?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 18); const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false) } }; const onPointer = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null) }; window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer); return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) } }, [])
  const isActive = (items: readonly (readonly [string, string])[]) => items.some(([, href]) => pathname === href || pathname.startsWith(href.replace('/#', '/')))
  return <header ref={ref} className={`premium-header ${scrolled ? 'is-scrolled' : ''}`}><div className="shell premium-nav">
    <Link href="/" className="brand" onClick={() => { setOpen(null); setMobile(false) }}><span className="brand-mark"><span /></span><span>SHWASA <small>/ respiratory acoustic intelligence</small></span></Link>
    <div className="premium-actions"><CommandPalette /><PreferencesPanel /><ShareButton /></div>
    <button className="menu-button premium-menu" onClick={() => setMobile(v => !v)} aria-expanded={mobile} aria-controls="premium-navigation">{mobile ? 'Close' : 'Menu'} <span>{mobile ? '×' : '+'}</span></button>
    <nav id="premium-navigation" className={`premium-links ${mobile ? 'is-open' : ''}`} aria-label="Primary navigation">
      <Link href={home ? '#top' : '/'} className={home && pathname === '/' ? 'active' : ''} onClick={() => setMobile(false)}>Home</Link>
      {groups.map(group => <div className={`nav-group ${open === group.label ? 'is-open' : ''}`} key={group.label}><button type="button" className={isActive(group.items) ? 'active' : ''} aria-expanded={open === group.label} onClick={() => setOpen(open === group.label ? null : group.label)}>{group.label}<span>+</span></button><div className="nav-menu">{group.items.map(([label, href]) => <Link key={href} href={href} onClick={() => { setOpen(null); setMobile(false) }}>{label}</Link>)}</div></div>)}
      <Link className="nav-cta" href={home ? '#try' : '/playground'} onClick={() => setMobile(false)}>Try the model <span>↗</span></Link>
    </nav>
  </div></header>
}

export { groups }
