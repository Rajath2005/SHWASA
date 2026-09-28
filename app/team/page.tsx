import { ResearchShell, PageIntro } from '@/components/research-shell'

const developers = [
	{ name: 'Rajath', handle: '@Rajath2005', href: 'https://github.com/Rajath2005', image: 'https://github.com/Rajath2005.png?size=256' },
	{ name: 'Sanath', handle: '@Sanath00007', href: 'https://github.com/Sanath00007', image: 'https://github.com/Sanath00007.png?size=256' },
	{ name: 'Rithesh', handle: '@Rithesh0115', href: 'https://github.com/Rithesh0115', image: 'https://github.com/Rithesh0115.png?size=256' },
	{ name: 'Sheethal', handle: '@Sheethal-2005', href: 'https://github.com/Sheethal-2005', image: 'https://github.com/Sheethal-2005.png?size=256' },
]

export default function TeamPage(){return <ResearchShell active="Team"><div className="container"><PageIntro eyebrow="08 / Team" title="Research is a team sport." copy="Meet the developers behind SHWASA. Four GitHub profiles, one shared respiratory-sound research system."/><div className="team-grid">{developers.map((developer, index) => <a className="team-member" href={developer.href} target="_blank" rel="noreferrer" key={developer.handle}><div className="team-member-top"><span className="team-index">{String(index + 1).padStart(2, '0')}</span><em aria-hidden="true">↗</em></div><img src={developer.image} alt={`${developer.name} GitHub profile`} loading="lazy" referrerPolicy="no-referrer"/><div className="team-member-copy"><strong>{developer.name}</strong><span>{developer.handle}</span></div></a>)}</div><p className="team-note">Four developers building, testing, documenting, and improving the respiratory-sound research system together.</p></div></ResearchShell>}
