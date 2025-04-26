export function essenceFromLifetimeEarnings(lifetimeEarnings: number): number {
  return Math.floor(Math.sqrt(lifetimeEarnings))
}

export const ESSENCE_MULTIPLIER_PER_POINT = 0.01

export function productionMultiplierFromEssence(essence: number): number {
  return 1 + essence * ESSENCE_MULTIPLIER_PER_POINT
}
