'use client'

import { useEffect, useState } from 'react'

const steps = [
  { target: '[data-tour="brand"]', eyebrow: '01 / Start here', title: 'This is SHWASA', copy: 'A research workspace for making respiratory sound analysis easier to understand. The navigation keeps the project story, tools, evidence, and resources close at hand.' },
  { target: '[data-tour="story"]', eyebrow: '02 / Understand the idea', title: 'Follow the project story', copy: 'Start with the research question, then move through the signal, model, result, and future direction in a guided narrative.' },
  { target: '[data-tour="pipeline"]', eyebrow: '03 / See the signal move', title: 'Trace audio into evidence', copy: 'The Pipeline explains what happens to a recording: capture, preprocessing, Log-Mel features, model stages, and the final research output.' },
  { target: '[data-tour="workspace"]', eyebrow: '04 / Try the workspace', title: 'Run an interactive sample', copy: 'The Playground is the hands-on surface. Listen to a reference recording, inspect its signal, upload audio when the connected service is available, and review the output.' },
  { target: '[data-tour="evidence"]', eyebrow: '05 / Inspect the evidence', title: 'Explore models, data, and evaluation', copy: 'Evidence contains the model architectures, dataset records, measured metrics, and dashboard status. The two model tracks are always labelled separately.' },
  { target: '[data-tour="resources"]', eyebrow: '06 / Meet the developers', title: 'See who built the project', copy: 'Open Resources, then choose Team to meet the people building, testing, documenting, and improving SHWASA.' },
]

export function SiteTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)
  const [targetRect, setTargetRect] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reducedMotion === 'true'
    setReady(true)
    if (!reduced && sessionStorage.getItem('shwasa-tour-seen') !== 'true') setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const element = document.querySelector(steps[step].target)
    document.querySelectorAll('[data-tour-active]').forEach(item => item.removeAttribute('data-tour-active'))
    element?.setAttribute('data-tour-active', 'true')
    element?.scrollIntoView({ behavior: document.documentElement.dataset.reducedMotion === 'true' ? 'auto' : 'smooth', block: 'center', inline: 'center' })
    const measure = () => {
      const rect = element?.getBoundingClientRect()
      if (rect) setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
    }
    const measureFrame = window.requestAnimationFrame(measure)
    const settleTimer = window.setTimeout(measure, 420)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
      if (event.key === 'ArrowRight' || event.key === 'Enter') next()
      if (event.key === 'ArrowLeft') previous()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.cancelAnimationFrame(measureFrame)
      window.clearTimeout(settleTimer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      element?.removeAttribute('data-tour-active')
    }
  }, [open, step])

  const finish = () => { sessionStorage.setItem('shwasa-tour-seen', 'true'); setOpen(false) }
  const next = () => step === steps.length - 1 ? finish() : setStep(value => value + 1)
  const previous = () => setStep(value => Math.max(0, value - 1))
  if (!ready) return null

  return <>
    <button className="tour-launcher" onClick={() => { setStep(0); setOpen(true) }} aria-label="Open site guide">Guide <span aria-hidden="true">?</span></button>
    {open && <div className="site-tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-spotlight" aria-hidden="true" style={{ top: targetRect.top - 8, left: targetRect.left - 8, width: targetRect.width + 16, height: targetRect.height + 16 }} />
      <div className="tour-card">
        <div className="tour-card-top"><span className="tiny-label">{steps[step].eyebrow}</span><button className="tour-skip" onClick={finish}>Skip guide</button></div>
        <div className="tour-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((item, index) => <i key={item.target} className={index <= step ? 'active' : ''} />)}</div>
        <h2 id="tour-title">{steps[step].title}</h2>
        <p>{steps[step].copy}</p>
        <div className="tour-actions"><button className="text-button" onClick={previous} disabled={step === 0}>Back</button><button className="button primary" onClick={next}>{step === steps.length - 1 ? 'Enter workspace' : 'Next'} <span aria-hidden="true">→</span></button></div>
      </div>
    </div>}
  </>
}
