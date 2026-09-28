'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CommandPalette } from './command-palette'
import { PreferencesPanel, ShareButton } from './preferences-panel'
import { SiteTour } from './site-tour'

const primaryLinks = [
  ['Overview', '/'],
  ['Project story', '/research'],
  ['Pipeline', '/pipeline'],
  ['Playground', '/playground'],
] as const

const groups = [
  { label: 'Evidence', hint: 'Inspect the work', items: [['Models', '/models'], ['Dataset', '/dataset'], ['Evaluation', '/evaluation'], ['Dashboard', '/dashboard']] },
  { label: 'Resources', hint: 'Read and build', items: [['Docs', '/docs'], ['Code', '/code'], ['Team', '/team']] },
] as const

export function PremiumNav({ home = false }: { home?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 18); const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false) } }; const onPointer = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null) }; window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer); return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) } }, [])
  const isActive = (items: readonly (readonly [string, string])[]) => items.some(([, href]) => pathname === href || pathname.startsWith(href.replace('/#', '/')))
  const isLinkActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href.replace('/#', '/'))
  return <header ref={ref} className={`premium-header ${scrolled ? 'is-scrolled' : ''}`}><div className="shell premium-nav">
    <Link href="/" className="brand" data-tour="brand" onClick={() => { setOpen(null); setMobile(false) }}><span className="brand-mark"><span /></span><span>SHWASA <small>/ respiratory acoustic intelligence</small></span></Link>
    <div className="premium-actions"><CommandPalette /><PreferencesPanel /><ShareButton /></div>
    <button className="menu-button premium-menu" onClick={() => setMobile(v => !v)} aria-expanded={mobile} aria-controls="premium-navigation">{mobile ? 'Close' : 'Menu'} <span>{mobile ? '×' : '+'}</span></button>
    <nav id="premium-navigation" className={`premium-links ${mobile ? 'is-open' : ''}`} aria-label="Primary navigation">
      {primaryLinks.map(([label, href]) => <Link key={href} data-tour={href === '/research' ? 'story' : href === '/pipeline' ? 'pipeline' : undefined} href={home && href === '/' ? '#top' : href} className={isLinkActive(href) ? 'active' : ''} onClick={() => setMobile(false)}>{label}</Link>)}
      {groups.map(group => <div className={`nav-group ${open === group.label ? 'is-open' : ''}`} key={group.label}><button type="button" data-tour={group.label === 'Evidence' ? 'evidence' : group.label === 'Resources' ? 'resources' : undefined} className={isActive(group.items) ? 'active' : ''} aria-expanded={open === group.label} onClick={() => setOpen(open === group.label ? null : group.label)}><span className="nav-group-label">{group.label}</span><span className="nav-group-mark">+</span></button><div className="nav-menu"><span className="nav-menu-hint">{group.hint}</span>{group.items.map(([label, href]) => <Link key={href} href={href} data-tour={href === '/team' ? 'team' : undefined} className={isLinkActive(href) ? 'active' : ''} onClick={() => { setOpen(null); setMobile(false) }}>{label}<span aria-hidden="true">↗</span></Link>)}</div></div>)}
      <Link className="nav-cta" href={home ? '#try' : '/playground'} data-tour="workspace" onClick={() => setMobile(false)}><span>Open workspace</span><span aria-hidden="true">↗</span></Link>
    </nav>
    <SiteTour />
  </div></header>
}

export { groups }
