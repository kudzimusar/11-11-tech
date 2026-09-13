import { projects as canonicalProjects, categories as canonicalCategories, type Project as CanonicalProject } from '../../../shared/projects'

export type Project = CanonicalProject & { accent: string; focus: string[] }

const accents: Record<string, string> = {
  Mobility: '#FF8E1E', Community: '#E9692B', Commerce: '#F0B323', Media: '#72AF4C', Trust: '#00ECFF', Education: '#CBFAFF', AI: '#9D7BFF', Property: '#56B4A6', Tools: '#7D8CA3',
}

export const projects: Project[] = canonicalProjects.map((project) => ({ ...project, accent: accents[project.category] ?? '#FF8E1E', focus: project.focus ?? [] }))
export const categories = canonicalCategories
export function getProject(slug?: string) { return projects.find((item) => item.slug === slug) }
