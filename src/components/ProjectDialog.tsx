import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { ProjectMark } from './ProjectMark'

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !project) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [project])

  if (!project) return null

  return <dialog ref={ref} className="project-dialog" onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose() }} aria-labelledby="project-dialog-title">
    <button className="dialog-close" type="button" onClick={onClose} aria-label="Close project details">×</button>
    <div className="dialog-head"><ProjectMark project={project} large /><div><div className="kicker">{project.category} · {project.region}</div><h2 id="project-dialog-title">{project.name}</h2><div className="project-tags"><span>{project.status}</span>{project.featured && <span>Featured</span>}</div></div></div>
    <p className="dialog-lede">{project.description}</p>
    {project.focus && <div className="dialog-section"><h3>Product focus</h3><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul></div>}
    <div className="dialog-actions">{project.repository && <a className="btn primary" href={project.repository} target="_blank" rel="noreferrer">View public repository ↗</a>}<button className="btn ghost" type="button" onClick={onClose}>Close</button></div>
  </dialog>
}
