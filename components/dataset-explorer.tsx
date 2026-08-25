'use client'

import { useMemo, useState } from 'react'

type RecordItem = { id: string; cohort: string; label: string; duration: string; rate: string; cue: string; color: string; values: number[] }

const records: RecordItem[] = [
  { id: 'PUL-0042', cohort: 'COPD', label: 'Wheeze', duration: '8.4 s', rate: '16 kHz', cue: 'Continuous tonal band', color: 'teal', values: [18,30,54,34,66,44,78,52,72,42,64,32,58,26,50,38,70,45,62,28] },
  { id: 'PUL-0118', cohort: 'COPD', label: 'Crackle', duration: '6.8 s', rate: '16 kHz', cue: 'Transient bursts', color: 'orange', values: [22,24,25,74,28,27,28,64,31,26,26,78,30,28,25,68,29,25,24,52] },
  { id: 'PUL-0207', cohort: 'Asthma', label: 'Wheeze', duration: '7.1 s', rate: '16 kHz', cue: 'Expiratory resonance', color: 'teal', values: [18,26,38,30,58,42,68,48,72,50,64,38,52,34,62,46,70,42,56,32] },
  { id: 'PUL-0321', cohort: 'Normal', label: 'Normal', duration: '5.9 s', rate: '16 kHz', cue: 'Low-noise airflow', color: 'blue', values: [25,30,27,33,28,32,26,34,29,31,27,32,25,33,29,35,27,31,26,34] },
  { id: 'PUL-0410', cohort: 'Normal', label: 'Crackle', duration: '9.2 s', rate: '16 kHz', cue: 'Fine basal events', color: 'orange', values: [20,24,27,30,26,72,28,25,29,31,66,27,25,30,28,76,26,25,30,28] },
]

export function DatasetExplorer() {
  const [cohort, setCohort] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('id')
  const [selected, setSelected] = useState(records[0])
  const [view, setView] = useState<'waveform' | 'spectrogram'>('waveform')
  const kaggleUrl = 'https://www.kaggle.com/datasets/vbookshelf/respiratory-sound-database'
  const filtered = useMemo(() => records.filter(r => (cohort === 'All' || r.cohort === cohort) && `${r.id} ${r.label} ${r.cohort}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === 'duration' ? parseFloat(b.duration) - parseFloat(a.duration) : a.id.localeCompare(b.id)), [cohort, query, sort])
  return <section className="dataset-explorer" aria-label="Illustrative dataset explorer">
    <div className="dataset-head"><div><span className="tiny-label">Dataset observatory / Respiratory Sound Database</span><h2>Listen by cohort.</h2><p>Explore a local, illustrative index of the Kaggle Respiratory Sound Database before jumping to the authoritative source.</p></div><div className="dataset-source"><span className="demo-badge">SOURCE / KAGGLE</span><a href={kaggleUrl} target="_blank" rel="noreferrer">View dataset ↗</a></div></div><div className="dataset-facts"><div><strong>920</strong><small>WAV files</small></div><div><strong>126</strong><small>patients</small></div><div><strong>6,898</strong><small>annotated cycles</small></div><div><strong>5.5 h</strong><small>audio captured</small></div></div>
    <div className="dataset-toolbar"><div className="cohort-tabs">{['All','COPD','Asthma','Normal'].map(item => <button key={item} className={cohort === item ? 'active' : ''} onClick={() => setCohort(item)}>{item}</button>)}</div><input aria-label="Search recordings" placeholder="Search ID or label" value={query} onChange={e => setQuery(e.target.value)} /><select aria-label="Sort recordings" value={sort} onChange={e => setSort(e.target.value)}><option value="id">Sort: recording ID</option><option value="duration">Sort: duration</option></select></div>
    <div className="dataset-grid"><div className="record-list" aria-label="Recordings">{filtered.map(record => <button className={`record-card ${selected.id === record.id ? 'selected' : ''}`} key={record.id} onClick={() => setSelected(record)}><span className={`record-mark ${record.color}`} /><div><strong>{record.id}</strong><small>{record.cohort} / {record.label}</small></div><div className="thumb-wave">{record.values.map((v,i) => <i key={i} style={{height:`${v}%`}} />)}</div><span className="record-arrow">↗</span></button>)}{!filtered.length && <p className="empty-state">No recordings match this filter.</p>}</div>
      <div className="record-detail"><div className="detail-top"><div><span className="tiny-label">Selected recording</span><h3>{selected.id}</h3><p>{selected.cohort} cohort · {selected.label}</p></div><span className={`label-chip ${selected.color}`}>{selected.label}</span></div><div className="detail-viewbar"><span className="tiny-label">Signal preview</span><div className="detail-tabs"><button className={view === 'waveform' ? 'active' : ''} onClick={() => setView('waveform')}>Waveform</button><button className={view === 'spectrogram' ? 'active' : ''} onClick={() => setView('spectrogram')}>Spectrogram</button></div></div><div className={`detail-wave ${view}`}>{selected.values.concat(selected.values).map((v,i) => <i key={i} style={{height:`${v}%`}} />)}<span className="playhead" /></div><div className="record-specs"><div><small>Duration</small><strong>{selected.duration}</strong></div><div><small>Sampling</small><strong>{selected.rate}</strong></div><div><small>Acoustic marker</small><strong>{selected.cue}</strong></div></div><div className="annotation-track"><span>ANNOTATIONS / 00:00</span><i className="annotation-crackle" /><i className="annotation-wheeze" /><i className="annotation-crackle second" /><span>00:08</span></div><div className="detail-spectrum">{Array.from({length:24},(_,i) => <i key={i} style={{height:`${25 + ((i*17 + selected.id.length*9)%65)}%`}} />)}</div><p className="detail-note">Signal preview is illustrative. Use the Playground to run a model-style prediction demo.</p></div></div>
  </section>
}
