'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

const destinations = [
  { label: 'Home', href: '/', group: 'Navigate', hint: 'Overview' },
  { label: 'Research Story', href: '/research', group: 'Research', hint: 'Project narrative' },
  { label: 'Pipeline', href: '/pipeline', group: 'Research', hint: 'Sound to signal' },
  { label: 'Models', href: '/models', group: 'Research', hint: 'Architecture' },
  { label: 'Dataset', href: '/dataset', group: 'Research', hint: 'Annotated records' },
  { label: 'Evaluation', href: '/evaluation', group: 'Research', hint: 'Metrics and evidence' },
  { label: 'Playground', href: '/playground', group: 'Explore', hint: 'Run a sample' },
  { label: 'Code', href: '/code', group: 'Explore', hint: 'Open implementation' },
  { label: 'Docs', href: '/docs', group: 'Explore', hint: 'Methods and notes' },
  { label: 'Team', href: '/team', group: 'About', hint: 'People behind SHWASA' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = useMemo(() => destinations.filter(item => `${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem('pulmo-recent-routes') || '[]')) } catch { setRecent([]) }
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(value => !value) }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => { if (open) { setQuery(''); requestAnimationFrame(() => inputRef.current?.focus()) } }, [open])
  const remember = (href: string) => {
    const next = [href, ...recent.filter(item => item !== href)].slice(0, 4)
    setRecent(next)
    localStorage.setItem('pulmo-recent-routes', JSON.stringify(next))
    setOpen(false)
  }
  const recentItems = recent.map(href => destinations.find(item => item.href === href)).filter(Boolean)
  return <>
    <button className="command-trigger" onClick={() => setOpen(true)} aria-label="Open command menu"><span>Search research</span><kbd>⌘ K</kbd></button>
    {open && <div className="command-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search SHWASA">
        <div className="command-search"><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search routes and research…" aria-label="Search routes and research" /><button onClick={() => setOpen(false)} aria-label="Close search">Esc</button></div>
        <div className="command-results">
          {!query && recentItems.length > 0 && <p className="command-heading">Recent</p>}
          {!query && recentItems.map(item => item && <Link key={`recent-${item.href}`} href={item.href} onClick={() => remember(item.href)} className="command-item"><span className="command-icon">↗</span><span><b>{item.label}</b><small>{item.hint}</small></span><em>Recent</em></Link>)}
          <p className="command-heading">{query ? `${filtered.length} results` : 'All research'}</p>
          {filtered.map(item => <Link key={item.href} href={item.href} onClick={() => remember(item.href)} className="command-item"><span className="command-icon">{item.label === 'Home' ? '⌂' : '→'}</span><span><b>{item.label}</b><small>{item.hint}</small></span><em>{item.group}</em></Link>)}
          {filtered.length === 0 && <p className="command-empty">No destination matches that search.</p>}
        </div>
        <footer className="command-footer"><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></footer>
      </section>
    </div>}
  </>
}
