import { useEffect, useState } from 'react'

interface ParticleEffectProps {
  trigger: number
}

export function ParticleEffect({ trigger }: ParticleEffectProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    if (trigger <= 0) return
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
    }))
    setParticles(newParticles)
    const t = setTimeout(() => setParticles([]), 600)
    return () => clearTimeout(t)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="particle-container" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{ '--x': p.x + 'px', '--y': p.y + 'px' } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
