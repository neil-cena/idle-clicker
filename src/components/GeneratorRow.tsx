import type { GeneratorDef } from '../engine/generators'
import { getCost, getProduction } from '../engine/generators'
import { formatNumber } from '../utils/format'

interface GeneratorRowProps {
  def: GeneratorDef
  owned: number
  energy: number
  onBuy: () => void
}

export function GeneratorRow({ def, owned, energy, onBuy }: GeneratorRowProps) {
  const cost = getCost(def, owned)
  const production = getProduction(def, owned)
  const canAfford = energy >= cost

  return (
    <div className="generator-row">
      <div className="generator-info">
        <span className="generator-name">{def.name}</span>
        <span className="generator-stats">Owned: {owned} \u00b7 +{formatNumber(production)}/s</span>
      </div>
      <button
        type="button"
        className="generator-buy"
        onClick={onBuy}
        disabled={!canAfford}
      >
        Buy ({formatNumber(cost)})
      </button>
    </div>
  )
}
