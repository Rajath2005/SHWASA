'use client'

import { useEffect, useState } from 'react'
import { PremiumNav } from '@/components/premium-nav'
import { ModelAccuracyChart, DatasetDistributionChart, RecentInferencesTable } from '@/components/dashboard-charts'
import { getCopdEffStatus, runCopdEffDatasetValidation, type CopdEffStatus } from '@/lib/copd-eff'

export default function DashboardPage() {
  const [status, setStatus] = useState<CopdEffStatus | null>(null)
  const [validating, setValidating] = useState(false)
  const [validationOutput, setValidationOutput] = useState<string | null>(null)

  useEffect(() => {
    getCopdEffStatus().then(setStatus).catch(() => setStatus(null))
  }, [])

  const validateDataset = async () => {
    setValidating(true)
    setValidationOutput(null)
    try {
      const result = await runCopdEffDatasetValidation()
      setValidationOutput(result.stdout || result.stderr || (result.success ? 'Dataset validation completed.' : result.error || 'Validation failed.'))
      getCopdEffStatus().then(setStatus).catch(() => undefined)
    } catch (error) {
      setValidationOutput(error instanceof Error ? error.message : 'Dataset validation is unavailable.')
    } finally {
      setValidating(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col">
      <PremiumNav />
      
      <div className="flex-1 py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <p className="eyebrow mb-4"><span className="status-dot" /> LIVE TELEMETRY</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Research <em className="premium-gradient not-italic">Dashboard</em>
          </h1>
          <p className="text-[var(--muted)] max-w-2xl text-lg">
            Monitor the connected COPD-EFF model, dataset readiness, and research telemetry from the respiratory acoustic pipeline.
          </p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] mb-6 border border-[var(--line)]" aria-label="COPD-EFF service status">
          <div className="bg-[var(--paper)] p-5"><span className="eyebrow">Service</span><strong className="block mt-3 text-xl">{status?.model_trained ? 'Online' : 'Demo / offline'}</strong></div>
          <div className="bg-[var(--paper)] p-5"><span className="eyebrow">Audio files</span><strong className="block mt-3 text-xl">{status?.audio_files_found ?? '—'}</strong></div>
          <div className="bg-[var(--paper)] p-5"><span className="eyebrow">Test accuracy</span><strong className="block mt-3 text-xl">{status?.metrics ? `${(status.metrics.accuracy * 100).toFixed(1)}%` : '—'}</strong></div>
          <div className="bg-[var(--paper)] p-5"><span className="eyebrow">Model</span><strong className="block mt-3 text-sm leading-tight">{status?.model || 'COPD-EFF'}</strong></div>
        </section>

        <section className="dashboard-provenance mb-6" aria-label="Connected model provenance">
          <div><span className="eyebrow">Connected track</span><h2>COPD-EFF / binary screening</h2><p>EfficientNetB0 + BiLSTM + 4-head attention. The live service returns COPD or NON-COPD probabilities.</p></div>
          <div className="dashboard-metrics">{[['Sensitivity', status?.metrics?.sensitivity_recall], ['Specificity', status?.metrics?.specificity], ['F1 score', status?.metrics?.f1_score], ['ROC-AUC', status?.metrics?.roc_auc]].map(([label, value]) => <div key={label as string}><span>{label as string}</span><strong>{typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '—'}</strong></div>)}</div>
        </section>

        <section className="dashboard-validation mb-6" aria-labelledby="validation-title">
          <div><span className="eyebrow">Dataset readiness</span><h2 id="validation-title">Check the evidence before you read the metrics.</h2><p>Run the connected COPD-EFF dataset validator to inspect audio files, annotations, patient IDs, and split readiness.</p></div>
          <div className="dashboard-validation-action"><button className="button primary" onClick={validateDataset} disabled={validating}>{validating ? 'Validating dataset…' : 'Run dataset validation'} <span aria-hidden="true">→</span></button>{validationOutput && <pre role="status" aria-live="polite">{validationOutput}</pre>}</div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Main Accuracy Chart */}
          <div className="glass-panel p-6 rounded-xl md:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--line)] pb-4">
              <div><h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Illustrative training trace</h2><p className="text-xs text-[var(--muted)] mt-1">Replace with persisted training history when available</p></div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--teal)] border border-[var(--teal)] px-2 py-1 rounded">DEMO DATA</span>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ModelAccuracyChart />
            </div>
          </div>

          {/* Dataset Distribution */}
          <div className="glass-panel p-6 rounded-xl flex flex-col">
            <div className="mb-6 border-b border-[var(--line)] pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Class Distribution</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Illustrative reference distribution · COPD-EFF is binary</p>
            </div>
            <div className="flex-1 min-h-[250px] flex items-center justify-center">
              <DatasetDistributionChart />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-[var(--muted)]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6dc4b5]"></span> Wheeze (40%)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#e3a078]"></span> Crackle (30%)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#a6bbb5]"></span> Normal (30%)</div>
            </div>
          </div>
        </div>

        {/* Recent Inferences Table */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--line)] pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Recent Inferences</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Illustrative local history until persistence is connected</p>
            </div>
            <button className="text-[11px] font-mono text-[var(--teal)] hover:underline">View All →</button>
          </div>
          <RecentInferencesTable />
        </div>
      </div>
    </main>
  )
}
