import { useState, useEffect, useRef } from 'react'
import { GeneratorRow } from './GeneratorRow'
import { GENERATORS, getCost, getTotalProduction } from '../engine/generators'
import { formatNumber } from '../utils/format'

export function MainView() {
  const [energy, setEnergy] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(GENERATORS.map((g) => [g.id, 0]))
  )
  const energyRef = useRef(energy)
  energyRef.current = energy

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    function loop(now: number) {
      const dt = (now - last) / 1000
      last = now
      const rate = getTotalProduction(counts)
      if (rate > 0) {
        setEnergy((e) => e + rate * dt)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [counts])

  function handleBuy(id: string) {
    const def = GENERATORS.find((g) => g.id === id)
    if (!def) return
    const owned = counts[id] ?? 0
    const cost = getCost(def, owned)
    if (energyRef.current < cost) return
    setEnergy((e) => e - cost)
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  }

  return (
    <div className="main-view">
      <p className="energy">Energy: {formatNumber(Math.floor(energy))}</p>
      <button type="button" className="btn-gather" onClick={() => setEnergy((e) => e + 1)}>
        Gather
      </button>
      <section className="generators">
        {GENERATORS.map((def) => (
          <GeneratorRow
            key={def.id}
            def={def}
            owned={counts[def.id] ?? 0}
            energy={energy}
            onBuy={() => handleBuy(def.id)}
          />
        ))}
      </section>
    </div>
  )
}
