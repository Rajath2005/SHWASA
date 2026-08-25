import { PremiumNav } from '@/components/premium-nav'
import { ModelAccuracyChart, DatasetDistributionChart, RecentInferencesTable } from '@/components/dashboard-charts'

export default function DashboardPage() {
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
            Monitor model training metrics, dataset distribution, and recent inference logs from the respiratory acoustic pipeline.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Main Accuracy Chart */}
          <div className="glass-panel p-6 rounded-xl md:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--line)] pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Model Accuracy (CNN + BiLSTM)</h2>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--teal)] border border-[var(--teal)] px-2 py-1 rounded">Epoch 1-10</span>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ModelAccuracyChart />
            </div>
          </div>

          {/* Dataset Distribution */}
          <div className="glass-panel p-6 rounded-xl flex flex-col">
            <div className="mb-6 border-b border-[var(--line)] pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Class Distribution</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Working set representation</p>
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
              <p className="text-xs text-[var(--muted)] mt-1">Latest playground executions</p>
            </div>
            <button className="text-[11px] font-mono text-[var(--teal)] hover:underline">View All →</button>
          </div>
          <RecentInferencesTable />
        </div>
      </div>
    </main>
  )
}
