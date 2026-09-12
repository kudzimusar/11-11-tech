import { useEffect, useState } from 'react'
import { media } from '../lib/media'

export function MotionHero() {
  const [motionEnabled, setMotionEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 840px)')
    const sync = () => setMotionEnabled(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return <figure className="motion-hero" aria-label="Abstract 11-11 Tech systems architecture in motion">
    <img className="motion-hero-poster" src={media.heroStill} alt="Cinematic abstract technology architecture with blue data routes" />
    {motionEnabled && <video className="motion-hero-video" autoPlay muted loop playsInline preload="metadata" poster={media.heroStill} aria-hidden="true">
      <source src={media.heroVideo} type="video/mp4" />
    </video>}
    <div className="motion-hero-vignette" aria-hidden="true" />
    <figcaption className="motion-hero-status"><span className="signal-dot" aria-hidden="true" />SYSTEM FIELD / LIVE</figcaption>
  </figure>
}
