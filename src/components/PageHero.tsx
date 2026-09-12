import type { ReactNode } from 'react'

export function PageHero({ kicker, title, children, index }: { kicker: string; title: ReactNode; children: ReactNode; index: string }) {
  return <section className="page-hero"><div className="wrap"><div className="index">{index}</div><div className="kicker reveal">{kicker}</div><h1 className="reveal">{title}</h1><p className="reveal">{children}</p></div></section>
}
