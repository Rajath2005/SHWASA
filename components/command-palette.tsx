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
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const wasOpenRef = useRef(false)
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
  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) triggerRef.current?.focus()
      return
    }
    wasOpenRef.current = true
    setQuery('')
    setActiveIndex(-1)
    requestAnimationFrame(() => inputRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('input, button, a') ?? []).filter(element => !element.hasAttribute('disabled'))
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
  const remember = (href: string) => {
    const next = [href, ...recent.filter(item => item !== href)].slice(0, 4)
    setRecent(next)
    localStorage.setItem('pulmo-recent-routes', JSON.stringify(next))
    setOpen(false)
  }
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const items = resultsRef.current?.querySelectorAll<HTMLAnchorElement>('.command-item')
    if (!items?.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index => Math.min(index + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      items[activeIndex]?.click()
    }
  }
  const recentItems = recent.map(href => destinations.find(item => item.href === href)).filter(Boolean)
  let resultIndex = 0
  return <>
    <button ref={triggerRef} className="command-trigger" onClick={() => setOpen(true)} aria-label="Find a page or research topic" title="Find a page or research topic"><span className="command-label">Find</span><span className="command-detail">Search</span><kbd>⌘ K</kbd></button>
    {open && <div className="command-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section ref={dialogRef} className="command-dialog" role="dialog" aria-modal="true" aria-label="Search SHWASA">
        <div className="command-search"><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={event => { setQuery(event.target.value); setActiveIndex(-1) }} onKeyDown={handleInputKeyDown} placeholder="Search routes and research…" aria-label="Search routes and research" /><button onClick={() => setOpen(false)} aria-label="Close search">Esc</button></div>
        <div className="command-results" ref={resultsRef}>
          {!query && recentItems.length > 0 && <p className="command-heading">Recent</p>}
          {!query && recentItems.map(item => { if (!item) return null; const index = resultIndex++; return <Link key={`recent-${item.href}`} href={item.href} onClick={() => remember(item.href)} className={`command-item ${activeIndex === index ? 'is-active' : ''}`}><span className="command-icon">↗</span><span><b>{item.label}</b><small>{item.hint}</small></span><em>Recent</em></Link> })}
          <p className="command-heading">{query ? `${filtered.length} results` : 'All research'}</p>
          {filtered.map(item => { const index = resultIndex++; return <Link key={item.href} href={item.href} onClick={() => remember(item.href)} className={`command-item ${activeIndex === index ? 'is-active' : ''}`}><span className="command-icon">{item.label === 'Home' ? '⌂' : '→'}</span><span><b>{item.label}</b><small>{item.hint}</small></span><em>{item.group}</em></Link> })}
          {filtered.length === 0 && <p className="command-empty">No destination matches that search.</p>}
        </div>
        <footer className="command-footer"><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></footer>
      </section>
    </div>}
  </>
}
