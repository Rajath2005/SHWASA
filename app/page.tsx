'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/reveal'
import { LivePipeline } from '@/components/live-pipeline'
import { ScrollStory } from '@/components/scroll-story'
import { PremiumNav } from '@/components/premium-nav'
import { getModelTrack } from '@/lib/model-registry'

const samples = [
  { name: 'wheeze_042.wav', type: 'Wheeze sample', detail: '3.2 sec · 16 kHz' },
  { name: 'crackle_018.wav', type: 'Crackle sample', detail: '4.8 sec · 16 kHz' },
  { name: 'healthy_009.wav', type: 'Healthy sample', detail: '2.9 sec · 16 kHz' },
]

const bars = [18, 30, 22, 44, 36, 58, 46, 67, 52, 76, 45, 62, 34, 55, 41, 72, 56, 36, 48, 29, 43, 23, 34, 18, 28, 15, 23, 12, 19, 10, 16, 8, 13, 7, 11, 5, 8, 5, 7, 4, 6, 3, 5, 4, 3, 5, 3, 4, 3]

function Arrow() { return <span aria-hidden="true">↗</span> }
function Waveform({ compact = false, active = false }: { compact?: boolean; active?: boolean }) {
  return <div className={compact ? 'waveform compact' : `waveform ${active ? 'is-active' : ''}`} aria-hidden="true">{bars.map((height, i) => <i key={i} style={{ height: `${compact ? Math.max(3, height * 0.48) : active ? Math.min(96, height + (i % 5) * 7) : height}%` }} />)}</div>
}

export default function Page() {
  const [selected, setSelected] = useState(0)
  const [result, setResult] = useState(false)
  const [running, setRunning] = useState(false)
  const [uploadedName, setUploadedName] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [signalActive, setSignalActive] = useState(false)
  const current = samples[selected]
  const copdEff = getModelTrack('copd-eff')
  const copdMod2 = getModelTrack('copd-mod2')

  return (
    <main>
      <ScrollStory />
      <PremiumNav home />

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Open respiratory-sound research <span className="eyebrow-line" /></p>
          <h1>Listen closer.<br /><em className="premium-gradient">Detect earlier.</em></h1>
          <p className="hero-text">A machine-learning toolkit for identifying COPD-related respiratory sounds — designed to make clinical audio more legible, one breath at a time.</p>
          <div className="hero-actions"><a className="button primary" href="#try">Explore the model <Arrow /></a><a className="text-link" href="#approach">Read the research <span>↓</span></a></div>
          <div className="hero-notes"><span><b>01</b> Audio-first</span><span><b>02</b> Research-grade</span><span><b>03</b> Open by design</span></div>
        </div>
          <div className={`hero-visual ${signalActive ? 'signal-active' : ''}`} aria-label="Interactive respiratory sound waveform" onPointerEnter={() => setSignalActive(true)} onPointerLeave={() => setSignalActive(false)} onFocus={() => setSignalActive(true)} onBlur={() => setSignalActive(false)} tabIndex={0}>
          <div className="visual-label label-top">RESPIRATORY AUDIO <span>● REC</span></div><div className="signal-constellation" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--signal-x': `${8 + i * 8}%`, '--signal-y': `${22 + ((i * 29) % 54)}%`, '--signal-delay': `${i * -0.32}s` } as React.CSSProperties} />)}</div><div className="signal-telemetry telemetry-left"><span>TIME DOMAIN</span><b>breath cycle</b></div><div className="signal-telemetry telemetry-right"><span>EVENT MAP</span><b>3 active bands</b></div><Waveform active={signalActive} /><div className={`signal-marker marker-one ${signalActive ? 'visible' : ''}`}>WHEEZE EVENT</div><div className={`signal-marker marker-two ${signalActive ? 'visible' : ''}`}>FRAME 042</div><div className="visual-axis"><span>00:00</span><span>00:02</span><span>00:04</span><span>00:06</span></div>
          <div className="visual-card"><span className="pulse-icon">≈</span><span><b>Signal detected</b><small>Multiple acoustic events in frame</small></span><strong>94<span>%</span></strong></div>
          <div className="visual-label label-bottom">COPD-EFF / SAMPLE 042 <span>16 KHZ</span></div>
        </div>
      </section>

      <Reveal delay={100}><section id="approach" className="intro band shell"><div className="section-kicker">The premise <span>01 — 04</span></div><div className="intro-content"><h2>Breath carries<br /><span>information.</span></h2><div><p className="large-copy">COPD changes the way air moves through the lungs. Those changes leave traces in sound — wheezes, crackles, and quiet moments that can be difficult to hear consistently.</p><p className="muted-copy">SHWASA turns respiratory recordings into structured signals that researchers can inspect, compare, and improve.</p></div></div></section></Reveal>

      <section id="pipeline" className="pipeline shell"><div className="section-kicker">From sound to signal <span>Our approach</span></div><LivePipeline /></section>

      <section id="results" className="metrics-band"><div className="shell metrics"><div><p className="section-kicker">Research snapshot <span>Dual-model study</span></p><h2>Built to be<br /><em>questioned.</em></h2><p className="metrics-note">Two complementary tasks, reported separately: binary COPD screening and four-class sound-event recognition.</p></div><div className="metric-list"><div><strong>{copdEff.metrics[0].value}</strong><span>{copdEff.shortName}<br />held-out accuracy</span></div><div><strong>{copdMod2.metrics[1].value}</strong><span>{copdMod2.shortName}<br />ICBHI score</span></div><div><strong>16k</strong><span>shared audio<br />sample rate</span></div></div></div></section>

      <section id="try" className="try-section shell"><div className="section-kicker">Interactive demo <span>Not for diagnosis</span></div><div className="try-grid"><div><h2>What does<br />this breath <em>say?</em></h2><p className="muted-copy">Choose a sample to see how the prototype translates sound into a readable model output.</p><a className="playground-hint" href="/playground"><span className="hint-pulse" />Need more control? <b>Open the full Playground →</b><small>Upload, listen, compare, and inspect telemetry.</small></a><div className="notice"><span>i</span><p>This is a research demonstration, not a medical device or clinical diagnosis.</p></div></div><div className="demo-card"><div className="demo-head"><div><span className="tiny-label">MODEL PLAYGROUND</span><h3>Respiratory sound classifier</h3></div><span className="version">v0.1</span></div><div className="sample-tabs">{samples.map((sample, i) => <button key={sample.name} className={selected === i ? 'active' : ''} onClick={() => { setSelected(i); setResult(false) }}><span className="sample-icon">{i === 0 ? '∿' : i === 1 ? '⌁' : '○'}</span>{sample.type}</button>)}</div><div className="upload-box upload-drop"><Waveform compact /><div className="upload-copy"><b>{uploadedName || current.name}</b><span>{uploadedName ? 'Custom audio · ready to analyze' : current.detail}</span><strong>{uploading ? 'Preparing audio…' : 'Drop WAV/MP3 here or '}<u>choose an audio file</u></strong></div><input type="file" accept="audio/*,.wav,.mp3,.m4a" onChange={event => { const file = event.target.files?.[0]; if (file) { setUploading(true); const url = URL.createObjectURL(file); setUploadedUrl(url); setUploadedName(file.name); setResult(false); window.setTimeout(() => setUploading(false), 500) } }} aria-label="Upload respiratory audio" /><button type="button" className="remove" onClick={() => { if (uploadedUrl) URL.revokeObjectURL(uploadedUrl); setUploadedUrl(''); setUploadedName(''); setResult(false) }} aria-label="Reset sample">×</button></div>{uploadedUrl && <audio className="uploaded-audio-preview" controls src={uploadedUrl} aria-label={`Preview ${uploadedName}`} />} {result ? <div className="prediction prediction-reveal"><div><span className="tiny-label">PREDICTION · COMPLETE</span><strong>Wheeze detected</strong><p>Acoustic pattern aligns with a wheeze event.</p></div><div className="confidence"><b>82%</b><span>confidence</span><i className="confidence-fill" /></div></div> : running ? <div className="prediction-loading" role="status"><span className="status-dot" /><span>Extracting acoustic features</span><b>64%</b><i /></div> : <button className="button primary full" onClick={() => { setRunning(true); window.setTimeout(() => { setRunning(false); setResult(true) }, 1800) }}>Run prediction <Arrow /></button>}<p className="demo-foot">Model output is illustrative · See <a href="#team">methodology</a></p></div></div></section>

      <footer id="team" className="footer shell"><div><a className="brand" href="#top"><span className="brand-mark"><span /></span><span>SHWASA</span></a><p>Making respiratory sound research<br />more open, inspectable, and useful.</p></div><div className="footer-links"><div><span>Explore</span><a href="#approach">The approach</a><a href="#pipeline">The pipeline</a><a href="#try">Try the model</a></div><div><span>Artifacts</span><a href="https://github.com/Sanath00007/copd-mod2" target="_blank" rel="noreferrer">copd-mod2 <Arrow /></a><a href="https://github.com/Sanath00007/COPD-EFF" target="_blank" rel="noreferrer">COPD-EFF <Arrow /></a></div></div><p className="copyright">© 2025 SHWASA · An open research prototype</p></footer>
    </main>
  )
}
