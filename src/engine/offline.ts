import type { SaveData } from './saveLoad'
import { getTotalProduction } from './generators'

export function simulateOfflineProgress(
  saved: SaveData,
  now: number
): { energy: number; lifetimeEarnings: number } {
  const elapsedSec = (now - saved.lastSaveTime) / 1000
  if (elapsedSec <= 0) return { energy: saved.energy, lifetimeEarnings: saved.lifetimeEarnings }
  const rate = getTotalProduction(saved.counts)
  const gained = rate * elapsedSec
  return {
    energy: saved.energy + gained,
    lifetimeEarnings: saved.lifetimeEarnings + gained,
  }
}
