'use client'

import { useEffect, useRef, useState } from 'react'

const stages = [
  { number: '01', title: 'Audio waveform', detail: 'raw respiratory signal', description: 'Capture breath cycles as a time-domain signal before any transformation.', kind: 'wave' },
  { number: '02', title: 'Preprocessing', detail: 'resample · normalize · slice', description: 'Standardize amplitude and duration so every clip enters the model consistently.', kind: 'prep' },
  { number: '03', title: 'Spectrogram / MFCC', detail: 'time-frequency features', description: 'Reveal sustained tones and transient events across the frequency axis.', kind: 'spectrum' },
  { number: '04', title: 'CNN backbone', detail: 'spatial representations', description: 'Encode local acoustic textures from the feature image.', kind: 'cnn' },
  { number: '05', title: 'BiLSTM', detail: 'temporal context', description: 'Read breath events in both directions to preserve sequence context.', kind: 'lstm' },
  { number: '06', title: 'Attention', detail: 'salient breath events', description: 'Weight the moments most informative for respiratory classification.', kind: 'attention' },
  { number: '07', title: 'Prediction', detail: 'COPD probability', description: 'Return an interpretable probability for the research prototype.', kind: 'prediction' },
]

function Evidence({ kind }: { kind: string }) {
  if (kind === 'wave') return <div className="stage-evidence wave-evidence">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ height: `${18 + ((i * 23) % 50)}%` }} />)}</div>
  if (kind === 'spectrum') return <div className="stage-evidence spectrum-evidence">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ opacity: `${.25 + ((i * 17) % 70) / 100}` }} />)}</div>
  if (kind === 'attention') return <div className="stage-evidence attention-evidence"><i /><i /><i /><i /><i /></div>
  return <div className={`stage-evidence node-evidence ${kind}`}><span /><span /><span /></div>
}

export function LivePipeline() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timer = useRef<number | null>(null)
  useEffect(() => { if (!playing) return; timer.current = window.setInterval(() => setActive(value => (value + 1) % stages.length), 2200); return () => { if (timer.current) window.clearInterval(timer.current) } }, [playing])
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === 'ArrowRight') setActive(value => Math.min(value + 1, stages.length - 1)); if (event.key === 'ArrowLeft') setActive(value => Math.max(value - 1, 0)); if (event.key === ' ') setPlaying(value => !value) }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [])
  const stage = stages[active]
  return <div className="pipeline-story" aria-label="Interactive COPD classification pipeline">
    <div className="live-pipeline" role="list">
      <div className="pipeline-track" aria-hidden="true"><span style={{ width: `${(active / (stages.length - 1)) * 100}%` }} /></div>
      {stages.map((item, index) => <button key={item.title} role="listitem" className={index === active ? 'pipeline-node active' : index < active ? 'pipeline-node passed' : 'pipeline-node'} onClick={() => { setActive(index); setPlaying(false) }} aria-label={`Show ${item.title}`} aria-current={index === active ? 'step' : undefined}><span className="node-number">{item.number}</span><span className="node-dot" /><strong>{item.title}</strong><small>{item.detail}</small></button>)}
      <div className="pipeline-readout"><span className="tiny-label">LIVE TRANSFORM</span><strong>{stage.title}</strong><span>{stage.detail}</span><i /></div>
    </div>
    <div className="pipeline-detail"><div><span className="tiny-label">STAGE {stage.number} / 07</span><h3>{stage.title}</h3><p>{stage.description}</p></div><Evidence kind={stage.kind} /><div className="pipeline-controls"><button className="text-button" onClick={() => setActive(value => Math.max(0, value - 1))} disabled={active === 0}>Previous</button><button className="button" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause flow' : 'Resume flow'}</button><button className="text-button" onClick={() => setActive(value => Math.min(stages.length - 1, value + 1))} disabled={active === stages.length - 1}>Next</button></div></div>
  </div>
}
