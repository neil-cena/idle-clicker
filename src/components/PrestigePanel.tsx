import { useGameStore } from '../engine/gameState'
import { essenceFromLifetimeEarnings } from '../engine/prestige'
import { formatNumber } from '../utils/format'

export function PrestigePanel() {
  const essence = useGameStore((s) => s.essence)
  const lifetimeEarnings = useGameStore((s) => s.lifetimeEarnings)
  const prestige = useGameStore((s) => s.prestige)

  const gain = essenceFromLifetimeEarnings(lifetimeEarnings)
  const canPrestige = gain > 0

  return (
    <div className="prestige-panel">
      <p>Essence: {formatNumber(essence)}</p>
      <p className="prestige-gain">+{formatNumber(gain)} on reset</p>
      <button
        type="button"
        className="btn-prestige"
        onClick={() => canPrestige && prestige()}
        disabled={!canPrestige}
      >
        Prestige
      </button>
    </div>
  )
}
