'use client'

import { useEffect, useState } from 'react'

const chapters = [
  { id: '01', title: 'The question', tag: 'WHY THIS MATTERS', heading: 'Can a breath carry a clinical signal?', copy: 'COPD screening often begins with equipment, appointments, and effort. This project explores whether the sound of breathing can become a more accessible research signal.', input: 'A short respiratory recording', output: 'A measurable acoustic trace', color: 'teal' },
  { id: '02', title: 'The signal', tag: 'FROM AUDIO TO EVIDENCE', heading: 'A waveform becomes a map.', copy: 'The raw recording is normalized, segmented, and represented as a time–frequency image. This makes hidden acoustic structure available to a learning system.', input: 'Waveform / .wav', output: 'Mel + MFCC features', color: 'metric' },
  { id: '03', title: 'The model', tag: 'LEARNING TEMPORAL CONTEXT', heading: 'Two views. One respiratory story.', copy: 'EfficientNet reads local visual patterns while a bidirectional recurrent layer follows how those patterns change over time. Attention highlights the moments that matter.', input: 'Feature sequence', output: 'Learned representation', color: 'teal' },
  { id: '04', title: 'The result', tag: 'RESEARCH OUTCOME', heading: 'A transparent operating point.', copy: 'The model output is evaluated across multiple views, not a single headline number. These figures are project results presented for research communication.', input: 'Probability score', output: 'Evaluated screening signal', color: 'status' },
]

const bars = [72, 48, 88, 61, 79, 94, 67, 42, 76, 57, 86, 70, 51, 91, 63, 81, 45, 74, 96, 58, 83, 68, 49, 89]

function ChapterVisual({ chapter }: { chapter: number }) {
  if (chapter === 0) return <div className="concept-visual concept-question"><div className="concept-grid" /><div className="lung-outline">◌</div><div className="raw-wave">{bars.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * -0.06}s` }} />)}</div><span className="marker marker-crackle">CRACKLE</span><span className="marker marker-quiet">QUIET</span><strong className="concept-caption">RAW RESPIRATORY TRACE / 08.4 SEC</strong></div>
  if (chapter === 1) return <div className="concept-visual concept-signal"><div className="concept-grid" /><div className="transform-stage"><div className="mini-wave">{bars.slice(0, 12).map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span>→</span><div className="spectrogram">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ height: `${25 + ((index * 19) % 70)}%`, opacity: `${0.35 + ((index * 7) % 60) / 100}` }} />)}</div></div><strong className="concept-caption">NORMALIZE / SEGMENT / REPRESENT</strong></div>
  if (chapter === 2) return <div className="concept-visual concept-model"><div className="concept-grid" /><div className="model-flow"><div className="feature-stack"><i /><i /><i /></div><span>→</span><div className="model-node"><b>EfficientNet</b><small>local patterns</small></div><span>→</span><div className="sequence-node"><i /><i /><i /><i /><small>BiLSTM</small></div><span>→</span><div className="attention-node"><b>ATTN</b><i /><i /><i /></div></div><strong className="concept-caption">FEATURE MAP → TEMPORAL CONTEXT → ATTENTION</strong></div>
  return <div className="concept-visual concept-result"><div className="concept-grid" /><div className="gauge"><div className="gauge-fill" /><span>0.877</span></div><div className="threshold-line"><i /> <span>THRESHOLD / 0.50</span></div><div className="metric-readout"><span>ACC <b>87.73%</b></span><span>F1 <b>92.51%</b></span><span>AUC <b>0.9313</b></span></div><strong className="concept-caption">OPERATING POINT / RESEARCH VIEW</strong></div>
}

export function ResearchStory() {
  const [chapter, setChapter] = useState(0)
  const [playing, setPlaying] = useState(true)
  const active = chapters[chapter]

  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setChapter((current) => (current + 1) % chapters.length), 3600); return () => window.clearInterval(timer) }, [playing])

  return <main className="research-story">
    <div className="story-topline"><span><i /> MAJOR PROJECT / FRONTEND RESEARCH STORY</span><span>DOCUMENTATION MODE / 2026</span></div>
    <section className="story-hero">
      <div><p className="tiny-label">SHWASA / Project narrative</p><h1>The sound of<br /><em>breathing,</em><br />made legible.</h1><p className="story-lede">An interactive visual account of a respiratory sound research project — from the question we asked to the evidence we measured.</p><div className="story-actions"><a className="button primary" href="#journey">Explore the story <span>↓</span></a><button className="text-button" onClick={() => setPlaying(!playing)}>{playing ? 'Pause story' : 'Play story'} <span>{playing ? 'Ⅱ' : '▶'}</span></button></div></div>
      <div className="hero-field" aria-label="Animated respiratory signal visualization"><div className="hero-grid" />{bars.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * -0.08}s` }} />)}<strong>RESPIRATORY SOUND / SIGNAL 001</strong><span className="hero-crosshair">+<small>INPUT</small></span></div>
    </section>
    <section className="story-statement"><span className="story-index">01—04</span><p>We are not presenting a diagnosis. We are making the research process visible: the data, transformations, architecture, and evaluation choices behind an experimental screening workflow.</p></section>
    <section id="journey" className="story-journey">
      <div className="story-rail">{chapters.map((item, index) => <button key={item.id} className={index === chapter ? 'active' : ''} onClick={() => setChapter(index)} aria-current={index === chapter ? 'step' : undefined}><span>{item.id}</span><b>{item.title}</b><small>{index === chapter ? 'NOW EXPLORING' : 'OPEN CHAPTER'}</small></button>)}</div>
      <div className={`story-chapter ${active.color}`} key={active.id}>
        <div className="chapter-visual"><ChapterVisual chapter={chapter} /><div className="chapter-number">{active.id}</div></div>
        <div className="chapter-copy"><p className="tiny-label">{active.tag}</p><h2>{active.heading}</h2><p>{active.copy}</p><div className="chapter-io"><div><small>INPUT</small><b>{active.input}</b></div><span>→</span><div><small>OUTPUT</small><b>{active.output}</b></div></div><div className="chapter-controls"><button className="text-button" onClick={() => setChapter((chapter - 1 + chapters.length) % chapters.length)}>← Previous</button><span>{active.id} / 04</span><button className="button primary" onClick={() => setChapter((chapter + 1) % chapters.length)}>Next chapter <span>→</span></button></div></div>
      </div>
    </section>
    <section className="story-results"><div><p className="tiny-label">Evidence, not decoration</p><h2>A model is only<br /><em>one part</em> of the story.</h2><p>Performance is read alongside data quality, patient-level separation, and the operating threshold. The interface keeps those decisions visible.</p></div><div className="result-metrics"><div><strong>87.73%</strong><span>Accuracy</span></div><div><strong>92.51%</strong><span>F1 score</span></div><div><strong>0.9313</strong><span>ROC-AUC</span></div><div><strong>83.80%</strong><span>Specificity</span></div></div></section>
    <section className="story-roadmap"><div><p className="tiny-label">Where this can go next</p><h2>From prototype<br />to <em>evidence.</em></h2></div><div className="roadmap-list"><article><span>01</span><div><h3>Severity classification</h3><p>Move beyond binary screening toward clinically meaningful severity groups.</p></div></article><article><span>02</span><div><h3>Broader validation</h3><p>Test across cohorts, devices, environments, and patient populations.</p></div></article><article><span>03</span><div><h3>Clinical partnership</h3><p>Translate an academic prototype into a carefully validated research tool.</p></div></article></div></section>
    <footer className="story-disclaimer"><span>i</span><p><strong>Research communication only.</strong> This page documents an academic project and does not provide medical diagnosis or clinical advice.</p></footer>
  </main>
}
