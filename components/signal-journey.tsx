'use client'

import { useEffect, useMemo, useState } from 'react'
import { getModelTrack, type ModelTrack } from '@/lib/model-registry'

function JourneyEvidence({ stage }: { stage: string }) {
  const bars = useMemo(() => Array.from({ length: 34 }, (_, index) => 18 + ((index * 29 + stage.length * 11) % 72)), [stage])
  return <div className={`journey-evidence journey-${stage}`} aria-hidden="true">
    {bars.map((height, index) => <i key={index} style={{ height: `${stage === 'representation' ? 25 + ((index * 17) % 70) : height}%`, animationDelay: `${index * -42}ms` }} />)}
    <span className="journey-beam" />
  </div>
}

export function SignalJourney() {
  const [track, setTrack] = useState<ModelTrack>('copd-eff')
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const definition = getModelTrack(track)
  const stage = definition.stages[active]

  useEffect(() => {
    setActive(0)
    setPlaying(true)
  }, [track])
  useEffect(() => {
    if (!playing || document.documentElement.dataset.reducedMotion === 'true') return
    const timer = window.setInterval(() => setActive(value => (value + 1) % definition.stages.length), 3000)
    return () => window.clearInterval(timer)
  }, [definition.stages.length, playing])

  return <section className="signal-journey" aria-labelledby="signal-journey-title">
    <div className="journey-header"><div><span className="tiny-label">CANONICAL SIGNAL JOURNEY</span><h2 id="signal-journey-title">One recording. A chain of evidence.</h2><p>Switch research tracks to see how the same respiratory sound becomes a different question and output.</p></div><div className="journey-switcher" role="tablist" aria-label="Model track"><button role="tab" aria-selected={track === 'copd-eff'} className={track === 'copd-eff' ? 'active' : ''} onClick={() => setTrack('copd-eff')}>COPD-EFF<span>binary screening</span></button><button role="tab" aria-selected={track === 'copd-mod2'} className={track === 'copd-mod2' ? 'active' : ''} onClick={() => setTrack('copd-mod2')}>copd-mod2<span>four sound events</span></button></div></div>
    <div className="journey-rail">{definition.stages.map((item, index) => <button key={item} className={index === active ? 'active' : index < active ? 'passed' : ''} onClick={() => { setActive(index); setPlaying(false) }} aria-current={index === active ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><b>{item}</b></button>)}</div>
    <div className="journey-stage" key={`${track}-${stage}`}><div className="journey-visual"><div className="journey-grid" /><JourneyEvidence stage={stage.toLowerCase().replaceAll(' ', '-')} /><strong>{stage}</strong><small>{definition.preprocessing[Math.min(active, definition.preprocessing.length - 1)]}</small></div><div className="journey-copy"><span className="tiny-label">{definition.shortName} · STAGE {active + 1} / {definition.stages.length}</span><h3>{stage}</h3><p>{active === 0 ? 'Start with the respiratory recording as inspectable evidence.' : active === definition.stages.length - 1 ? `Return ${definition.outputLabel.toLowerCase()} for research review.` : `Transform the signal so ${definition.name} can read the next layer of evidence.`}</p><div className="journey-readout"><span>INPUT <b>{active === 0 ? 'audio recording' : definition.stages[active - 1]}</b></span><span>OUTPUT <b>{stage}</b></span></div><button className="button" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause journey' : 'Play journey'} <span>{playing ? 'Ⅱ' : '▶'}</span></button></div></div>
    <footer className="journey-footer"><span>{definition.task}</span><span>{definition.disclaimer}</span></footer>
  </section>
}