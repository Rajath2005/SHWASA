'use client'

import { useEffect, useState } from 'react'

const chapters = [
  ['top', 'Top'],
  ['approach', 'Premise'],
  ['pipeline', 'Pipeline'],
  ['results', 'Results'],
  ['try', 'Demo'],
  ['team', 'Team'],
]

export function ScrollStory() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('top')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0)
      const midpoint = window.innerHeight * 0.38
      let current = chapters[0][0]
      for (const [id] of chapters) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= midpoint) current = id
      }
      setActive(current)
      document.documentElement.style.setProperty('--scroll-progress', `${window.scrollY * 0.045}px`)
      document.documentElement.style.setProperty('--scroll-hero-shift', `${Math.min(42, window.scrollY * 0.09)}px`)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  return <>
    <div className="scroll-progress" aria-hidden="true"><span style={{ height: `${progress}%` }} /></div>
    <nav className="chapter-rail" aria-label="Homepage chapters">
      {chapters.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-label={`Jump to ${label}`}><span>{label}</span></a>)}
    </nav>
  </>
}
