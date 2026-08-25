'use client'

import { Reveal } from './reveal'
import { PremiumNav } from './premium-nav'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  ['Pipeline', '/pipeline'], ['Models', '/models'], ['Dataset', '/dataset'], ['Evaluation', '/evaluation'], ['Playground', '/playground'], ['Code', '/code'], ['Docs', '/docs'], ['Team', '/team'],
]

export function ResearchShell({ children, active }: { children: React.ReactNode; active: string }) {
  const pathname = usePathname()
  return <div className="research-shell">
    <PremiumNav /><div className="shell status-strip"><span><i /> LIVE RESEARCH PROTOTYPE</span><span>NOT FOR CLINICAL DIAGNOSIS</span></div>
    <main><Reveal>{children}</Reveal></main>
    <footer className="site-footer shell"><span>SHWASA · RESPIRATORY ACOUSTIC INTELLIGENCE</span><span>OPEN METHODS / INSPECTABLE OUTPUTS</span></footer>
  </div>
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <section className="page-intro"><p className="eyebrow"><span className="status-dot" />{eyebrow}</p><h1>{title}</h1><p className="lede">{copy}</p></section> }
export function Stat({ value, label }: { value: string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }
export function ArtifactGrid({ items }: { items: { title: string; text: string; href?: string }[] }) { return <div className="artifact-grid">{items.map((item, index) => <article className="artifact-card" key={item.title}><span className="card-index">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p>{item.href && <Link href={item.href}>Open artifact <span>↗</span></Link>}</article>)}</div> }
