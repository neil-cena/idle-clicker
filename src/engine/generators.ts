export interface GeneratorDef {
  id: string
  name: string
  baseCost: number
  growthRate: number
  productionPerUnit: number
}

export const GENERATORS: GeneratorDef[] = [
  { id: 'spark', name: 'Spark', baseCost: 10, growthRate: 1.07, productionPerUnit: 0.5 },
  { id: 'cell', name: 'Cell', baseCost: 100, growthRate: 1.1, productionPerUnit: 4 },
  { id: 'core', name: 'Core', baseCost: 1100, growthRate: 1.12, productionPerUnit: 20 },
]

export function getCost(def: GeneratorDef, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.growthRate, owned))
}

export function getProduction(def: GeneratorDef, owned: number): number {
  return owned * def.productionPerUnit
}

export function getTotalProduction(counts: Record<string, number>): number {
  return GENERATORS.reduce((sum, g) => sum + getProduction(g, counts[g.id] ?? 0), 0)
}
