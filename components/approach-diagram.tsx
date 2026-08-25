'use client'

import { useEffect, useState } from 'react'

export function ApproachDiagram({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <figure className={`approach-diagram image-story ${revealed ? 'is-revealed' : ''}`}>
      <div className="story-kicker"><span>Research artifact</span><span>Interactive figure</span></div>
      <button type="button" className="story-image-button" onClick={() => setOpen(true)} aria-label={`Open ${title} diagram`}>
        <span className="story-scan" aria-hidden="true" />
        <img src={src} alt={alt} loading="eager" />
        <span className="story-expand" aria-hidden="true">View full figure ↗</span>
      </button>
      <figcaption><span>{title}</span><span>Click to inspect · Esc to close</span></figcaption>
      {open && <div className="diagram-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
        <button type="button" className="diagram-close" onClick={() => setOpen(false)} aria-label="Close diagram">Close</button>
        <div className="lightbox-caption"><span className="tiny-label">Full resolution</span><strong>{title}</strong></div>
        <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
      </div>}
    </figure>
  )
}

export function StoryImage({ src, alt, title, detail }: { src: string; alt: string; title: string; detail?: string }) {
  return <figure className="story-image-card"><div className="story-image-frame"><img src={src} alt={alt} loading="lazy" /></div><figcaption><span>{title}</span>{detail && <small>{detail}</small>}</figcaption></figure>
}
