import { useGameStore } from '../engine/gameState'
import { essenceFromLifetimeEarnings } from '../engine/prestige'
import { formatNumber } from '../utils/format'

interface PrestigePanelProps {
  onPrestige?: () => void
}

export function PrestigePanel({ onPrestige }: PrestigePanelProps) {
  const essence = useGameStore((s) => s.essence)
  const lifetimeEarnings = useGameStore((s) => s.lifetimeEarnings)
  const prestige = useGameStore((s) => s.prestige)

  const gain = essenceFromLifetimeEarnings(lifetimeEarnings)
  const canPrestige = gain > 0

  function handlePrestige() {
    if (!canPrestige) return
    prestige()
    onPrestige?.()
  }

  return (
    <div className="prestige-panel">
      <p>Essence: {formatNumber(essence)}</p>
      <p className="prestige-gain">+{formatNumber(gain)} on reset</p>
      <button
        type="button"
        className="btn-prestige"
        onClick={handlePrestige}
        disabled={!canPrestige}
      >
        Prestige
      </button>
    </div>
  )
}
