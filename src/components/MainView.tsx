import { useGameStore } from '../engine/gameState'
import { GeneratorRow } from './GeneratorRow'
import { GENERATORS } from '../engine/generators'
import { formatNumber } from '../utils/format'

export function MainView() {
  const energy = useGameStore((s) => s.energy)
  const counts = useGameStore((s) => s.counts)
  const click = useGameStore((s) => s.click)
  const buy = useGameStore((s) => s.buy)

  return (
    <div className="main-view">
      <p className="energy">Energy: {formatNumber(Math.floor(energy))}</p>
      <button type="button" className="btn-gather" onClick={click}>
        Gather
      </button>
      <section className="generators">
        {GENERATORS.map((def) => (
          <GeneratorRow
            key={def.id}
            def={def}
            owned={counts[def.id] ?? 0}
            energy={energy}
            onBuy={() => buy(def.id)}
          />
        ))}
      </section>
    </div>
  )
}
