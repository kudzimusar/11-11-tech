import type { Project } from '../data/projects'

const aliases: Record<string, string> = {
  carup: 'CU', 'church-os': 'CO', sessions: 'SS', healthtimes: 'HT', 'morning-pulse': 'MP',
  wewed: 'WW', direkt: 'DK', 'alt-game-center': 'AG', 'count-with-dad': 'CD', 'kotsu-sensei': 'KS',
  'phonics-kids-pro': 'PK', 'pay-pass': 'PP', 'paid-refer': 'PR', schoolrun: 'SR', tengasell: 'TS',
  billify: 'BG', 'reverse-verify': 'RV', jd2cv: 'JD', characterforge: 'CF', growhome: 'GH',
  rentguarantee: 'RG', 'agentic-ai': 'AI',
}

export function ProjectMark({ project, large = false }: { project: Project; large?: boolean }) {
  return <span className={`project-mark ${large ? 'large' : ''}`} aria-hidden="true">
    <span className="project-mark-grid" />
    <strong>{aliases[project.slug] ?? project.name.slice(0, 2).toUpperCase()}</strong>
    <i />
  </span>
}
