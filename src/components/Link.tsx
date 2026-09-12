import type { AnchorHTMLAttributes, MouseEvent, PropsWithChildren } from 'react'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function hrefFor(path: string) {
  if (/^(https?:|mailto:|tel:)/.test(path) || path.startsWith('#')) return path
  const [pathname, hash = ''] = path.split('#')
  const clean = pathname === '/' ? '' : pathname.replace(/^\//, '')
  const href = `${base}/${clean}` || '/'
  return hash ? `${href}#${hash}` : href
}

type Props = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>

export function Link({ to, children, onClick, ...props }: Props) {
  const href = hrefFor(to)
  const external = /^(https?:|mailto:|tel:)/.test(to)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || props.target || external || to.startsWith('#')) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new Event('app:navigate'))

    const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : ''
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
    }
  }

  return <a href={href} onClick={handleClick} {...props}>{children}</a>
}
