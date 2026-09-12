import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

type Point = { x: number; y: number; r: number; tier: number }

const points: Point[] = [
  { x: .08, y: .53, r: 4, tier: 0 }, { x: .18, y: .28, r: 5, tier: 1 },
  { x: .26, y: .69, r: 4, tier: 1 }, { x: .36, y: .42, r: 7, tier: 2 },
  { x: .46, y: .18, r: 4, tier: 1 }, { x: .52, y: .63, r: 6, tier: 2 },
  { x: .62, y: .36, r: 5, tier: 1 }, { x: .72, y: .17, r: 4, tier: 0 },
  { x: .78, y: .59, r: 7, tier: 2 }, { x: .9, y: .35, r: 4, tier: 0 },
  { x: .92, y: .75, r: 5, tier: 1 }, { x: .6, y: .82, r: 3, tier: 0 },
]

const edges = [[0,1],[0,2],[1,3],[2,3],[2,5],[3,4],[3,5],[3,6],[4,6],[4,7],[5,6],[5,8],[5,11],[6,7],[6,8],[7,9],[8,9],[8,10],[8,11],[9,10]] as const

export function SystemField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const burstUntil = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = host.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const position = (point: Point) => {
      let x = point.x * width
      let y = point.y * height
      const pointer = pointerRef.current
      if (pointer) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        const distance = Math.max(24, Math.hypot(dx, dy))
        if (distance < 180) {
          const force = (180 - distance) / 180
          x += (dx / distance) * force * 13
          y += (dy / distance) * force * 13
        }
      }
      return { x, y }
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const gradient = ctx.createRadialGradient(width * .56, height * .47, 8, width * .56, height * .47, Math.max(width, height) * .7)
      gradient.addColorStop(0, 'rgba(33, 93, 255, .14)')
      gradient.addColorStop(.5, 'rgba(7, 25, 57, .06)')
      gradient.addColorStop(1, 'rgba(4, 9, 18, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      edges.forEach(([a, b], index) => {
        const pa = position(points[a])
        const pb = position(points[b])
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = index % 4 === 0 ? 'rgba(123, 223, 255, .35)' : 'rgba(70, 121, 255, .22)'
        ctx.lineWidth = 1
        ctx.stroke()

        const phase = ((time * .00012) + index * .117) % 1
        const x = pa.x + (pb.x - pa.x) * phase
        const y = pa.y + (pb.y - pa.y) * phase
        const pulse = ctx.createRadialGradient(x, y, 0, x, y, 12)
        pulse.addColorStop(0, index % 5 === 0 ? 'rgba(244, 182, 107, .95)' : 'rgba(123, 223, 255, .95)')
        pulse.addColorStop(1, 'rgba(52, 124, 255, 0)')
        ctx.fillStyle = pulse
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()
      })

      const bursting = performance.now() < burstUntil.current
      points.forEach((point, index) => {
        const p = position(point)
        const radius = point.r + (bursting && index % 3 === 0 ? 3 : 0)
        ctx.shadowColor = point.tier === 2 ? 'rgba(123, 223, 255, .8)' : 'rgba(52, 124, 255, .45)'
        ctx.shadowBlur = point.tier === 2 ? 18 : 10
        ctx.fillStyle = point.tier === 2 ? '#7bdfff' : index % 5 === 0 ? '#f4b66b' : '#347cff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius + 7 + Math.sin(time * .002 + index) * 2, 0, Math.PI * 2)
        ctx.strokeStyle = point.tier === 2 ? 'rgba(123,223,255,.22)' : 'rgba(52,124,255,.12)'
        ctx.stroke()
      })

      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(() => {
      resize()
      if (reduceMotion) draw(0)
    })
    observer.observe(host)
    if (reduceMotion) draw(0)
    else frame = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  const movePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const pulse = () => { burstUntil.current = performance.now() + 1500 }

  return <div className="system-field-shell reveal">
    <div ref={hostRef} className="system-field" onPointerMove={movePointer} onPointerLeave={() => { pointerRef.current = null }}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="system-field-grid" aria-hidden="true" />
      <div className="system-field-labels" aria-hidden="true">
        <span>IDENTITY</span><span>EVIDENCE</span><span>INTELLIGENCE</span><span>OPERATIONS</span>
      </div>
      <div className="system-field-readout"><small>LIVE SYSTEM TOPOLOGY</small><strong>01 → N</strong><span>signals · authority · evidence · action</span></div>
    </div>
    <button className="system-pulse-button" type="button" onClick={pulse}>Inject signal <span aria-hidden="true">↗</span></button>
  </div>
}
