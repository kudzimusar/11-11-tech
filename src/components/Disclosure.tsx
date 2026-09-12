import { useId, useState, type ReactNode } from 'react'

export function Disclosure({ title, eyebrow, summary, children, defaultOpen = false }: {
  title: string
  eyebrow?: string
  summary?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return <section className={`disclosure ${open ? 'open' : ''}`}>
    <button className="disclosure-trigger" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
      <span className="disclosure-copy">{eyebrow && <small>{eyebrow}</small>}<strong>{title}</strong>{summary && <span>{summary}</span>}</span>
      <span className="disclosure-icon" aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    <div id={id} className="disclosure-panel" hidden={!open}>{children}</div>
  </section>
}
