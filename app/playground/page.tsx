import { ResearchShell, PageIntro } from '@/components/research-shell'
import { PlaygroundDemo } from '@/components/playground-demo'

export default function PlaygroundPage() {
  return <ResearchShell active="Playground"><div className="container"><PageIntro eyebrow="05 / Playground" title="Listen. Then inspect." copy="Drop a short recording into the research surface and see how a prototype prediction is assembled."/><PlaygroundDemo /></div></ResearchShell>
}
