import { useGameStore } from '../engine/gameState'
import { GeneratorRow } from './GeneratorRow'
import { ResourceDisplay } from './ResourceDisplay'
import { GENERATORS } from '../engine/generators'

interface MainViewProps {
  playClick: () => void
  playBuy: () => void
}

export function MainView({ playClick, playBuy }: MainViewProps) {
  const energy = useGameStore((s) => s.energy)
  const counts = useGameStore((s) => s.counts)
  const click = useGameStore((s) => s.click)
  const buy = useGameStore((s) => s.buy)

  function handleClick() {
    playClick()
    click()
  }

  function handleBuy(id: string) {
    buy(id)
    playBuy()
  }

  return (
    <div className="main-view">
      <p className="energy">
        Energy: <ResourceDisplay value={energy} />
      </p>
      <button type="button" className="btn-gather" onClick={handleClick}>
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
