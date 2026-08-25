'use client'

import { useEffect, useMemo, useState } from 'react'

const stages = [
  { id: 'capture', num: '01', title: 'Capture', kicker: 'RAW SIGNAL', summary: 'A breath becomes a measurable waveform.', body: 'The microphone records pressure changes through a short, repeatable chest-sound protocol. Nothing is classified yet: this is the unedited evidence.', input: 'Chest sound / 1–10 sec', output: 'Time-domain waveform', color: 'signal' },
  { id: 'clean', num: '02', title: 'Clean', kicker: 'SIGNAL CONTROL', summary: 'Noise is reduced. Timing is made comparable.', body: 'The signal is resampled, normalized, sliced into fixed windows, and checked for quality so each recording enters the same computational shape.', input: 'Variable recording', output: '16 kHz fixed window', color: 'clean' },
  { id: 'represent', num: '03', title: 'Represent', kicker: 'FEATURE SPACE', summary: 'Sound becomes a visual pattern the model can read.', body: 'Mel spectrograms and MFCCs expose both sustained tones and transient events across time and frequency.', input: 'Clean waveform', output: 'Feature tensor', color: 'feature' },
  { id: 'predict', num: '04', title: 'Predict', kicker: 'MODEL OUTPUT', summary: 'Multiple views combine into a reviewable signal.', body: 'CNN, BiLSTM, and attention layers read acoustic texture and temporal context before returning a probability for research review.', input: 'Feature tensor', output: 'Probability + evidence', color: 'predict' },
]

function MiniSignal({ kind }: { kind: string }) {
  const bars = useMemo(() => Array.from({ length: 42 }, (_, i) => 20 + ((i * 37 + kind.length * 13) % 66)), [kind])
  return <div className={`architecture-signal ${kind}`} aria-hidden="true">{bars.map((height, i) => <i key={i} style={{ height: `${kind === 'feature' ? 25 + ((i * 19) % 70) : height}%`, animationDelay: `${i * 18}ms` }} />)}<span className="architecture-scan" /></div>
}

export function ArchitectureExplorer() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const stage = stages[active]
  useEffect(() => { if (!playing) return; const id = window.setInterval(() => setActive(value => (value + 1) % stages.length), 4200); return () => window.clearInterval(id) }, [playing])
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'ArrowRight') { setPlaying(false); setActive(value => Math.min(value + 1, stages.length - 1)) }; if (event.key === 'ArrowLeft') { setPlaying(false); setActive(value => Math.max(value - 1, 0)) }; if (event.key === ' ') { event.preventDefault(); setPlaying(value => !value) } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [])
  return <section className="architecture-explorer" aria-label="Interactive model architecture explorer">
    <div className="architecture-topline"><span className="live-label"><i /> LIVE ARCHITECTURE</span><span>SPACE TO PAUSE · ARROW KEYS TO STEP</span></div>
    <div className="architecture-header"><div><span className="section-kicker">THE MODEL, EXPLAINED</span><h2>How sound becomes a signal.</h2><p>Follow one recording through the system. Each stage changes the question the model is able to ask.</p></div><button className="architecture-play" onClick={() => setPlaying(value => !value)} aria-pressed={!playing}>{playing ? 'Pause story' : 'Play story'} <span>{playing ? 'Ⅱ' : '▶'}</span></button></div>
    <div className="architecture-rail" aria-label="Architecture stages">{stages.map((item, index) => <button key={item.id} className={index === active ? 'architecture-step active' : index < active ? 'architecture-step passed' : 'architecture-step'} onClick={() => { setActive(index); setPlaying(false) }} aria-current={index === active ? 'step' : undefined}><span>{item.num}</span><b>{item.title}</b><small>{item.kicker}</small></button>)}</div>
    <div className="architecture-body"><div key={`visual-${stage.id}`} className={`architecture-visual ${stage.color}`}><div className="visual-grid" /><div className="representation-transition" aria-hidden="true"><span className="transition-node">{stage.input}</span><i className="transition-line"><b /></i><span className="transition-node output">{stage.output}</span></div><MiniSignal kind={stage.color} /><div className="visual-token token-a">{stage.input}</div><div className="visual-token token-b">{stage.output}</div><div className="visual-center">{stage.num}<small>{stage.title}</small></div></div><div className="architecture-copy" aria-live="polite"><span className="section-kicker">STAGE {stage.num} / 04 · {stage.kicker}</span><h3>{stage.summary}</h3><p>{stage.body}</p><div className="architecture-io"><div><small>INPUT</small><b>{stage.input}</b></div><span>→</span><div><small>OUTPUT</small><b>{stage.output}</b></div></div><div className="architecture-controls"><button className="text-button" onClick={() => setActive(value => Math.max(value - 1, 0))} disabled={active === 0}>← Previous</button><button className="button" onClick={() => { setActive(value => Math.min(value + 1, stages.length - 1)); setPlaying(false) }} disabled={active === stages.length - 1}>Next stage →</button></div></div></div>
    <div className="architecture-foot"><span><b>WHY THIS MATTERS</b> Traceability over black-box magic.</span><span>Research prototype · not for diagnosis</span></div>
  </section>
}
