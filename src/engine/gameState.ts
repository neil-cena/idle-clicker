import { create } from 'zustand'
import { GENERATORS, getCost, getMilestoneMultiplier } from './generators'
import { essenceFromLifetimeEarnings, productionMultiplierFromEssence } from './prestige'
import { load, save } from './saveLoad'
import { simulateOfflineProgress } from './offline'

const SAVE_INTERVAL_MS = 5000

const initialCounts = () => Object.fromEntries(GENERATORS.map((g) => [g.id, 0]))

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function safeCounts(raw: unknown): Record<string, number> {
  const counts = initialCounts()
  if (!raw || typeof raw !== 'object') return counts
  for (const g of GENERATORS) {
    const owned = safeNumber((raw as Record<string, unknown>)[g.id], 0)
    counts[g.id] = Math.max(0, Math.floor(owned))
  }
  return counts
}

interface GameState {
  energy: number
  counts: Record<string, number>
  essence: number
  lifetimeEarnings: number
  lastSaveTime: number
  lastTickTime: number
  tick: (now: number) => void
  click: () => void
  buy: (id: string) => void
  prestige: () => void
  loadGame: () => void
  applyOffline: () => void
}

export const useGameStore = create<GameState>()((set, get) => ({
      energy: 0,
      counts: initialCounts(),
      essence: 0,
      lifetimeEarnings: 0,
      lastSaveTime: Date.now(),
      lastTickTime: Date.now(),

      tick(now: number) {
        const state = get()
        const tickNow = safeNumber(now, Date.now())
        const dt = (tickNow - safeNumber(state.lastTickTime, tickNow)) / 1000
        if (dt <= 0) return
        let rate = 0
        GENERATORS.forEach((g) => {
          const owned = safeNumber(state.counts[g.id], 0)
          rate += (owned * g.productionPerUnit) * getMilestoneMultiplier(owned)
        })
        const mult = productionMultiplierFromEssence(safeNumber(state.essence, 0))
        const gained = safeNumber(rate * dt * mult, 0)
        set({
          energy: safeNumber(state.energy, 0) + gained,
          lifetimeEarnings: safeNumber(state.lifetimeEarnings, 0) + gained,
          lastTickTime: tickNow,
        })
      },

      click() {
        const mult = productionMultiplierFromEssence(safeNumber(get().essence, 0))
        set((s) => ({
          energy: safeNumber(s.energy, 0) + 1 * mult,
          lifetimeEarnings: safeNumber(s.lifetimeEarnings, 0) + 1 * mult,
        }))
      },

      buy(id: string) {
        const def = GENERATORS.find((g) => g.id === id)
        if (!def) return
        const state = get()
        const owned = safeNumber(state.counts[id], 0)
        const cost = getCost(def, owned)
        if (safeNumber(state.energy, 0) < cost) return
        set((s) => ({
          energy: safeNumber(s.energy, 0) - cost,
          counts: { ...s.counts, [id]: safeNumber(s.counts[id], 0) + 1 },
        }))
      },

      prestige() {
        const state = get()
        const lifetime = safeNumber(state.lifetimeEarnings, 0)
        const currentEssence = safeNumber(state.essence, 0)
        const newEssence = essenceFromLifetimeEarnings(lifetime)
        if (newEssence <= currentEssence) return
        set({
          energy: 0,
          counts: initialCounts(),
          essence: currentEssence + newEssence,
          lifetimeEarnings: 0,
          lastSaveTime: Date.now(),
        })
      },

      loadGame() {
        const data = load() as Partial<{
          energy: unknown
          counts: unknown
          essence: unknown
          lifetimeEarnings: unknown
          lastSaveTime: unknown
        }> | null
        if (!data) return
        set({
          energy: safeNumber(data.energy, 0),
          counts: safeCounts(data.counts),
          essence: safeNumber(data.essence, 0),
          lifetimeEarnings: safeNumber(data.lifetimeEarnings, 0),
          lastSaveTime: safeNumber(data.lastSaveTime, Date.now()),
          lastTickTime: Date.now(),
        })
      },

      applyOffline() {
        const data = load() as Partial<{
          energy: unknown
          counts: unknown
          essence: unknown
          lifetimeEarnings: unknown
          lastSaveTime: unknown
        }> | null
        if (!data) return
        const sanitized = {
          energy: safeNumber(data.energy, 0),
          counts: safeCounts(data.counts),
          essence: safeNumber(data.essence, 0),
          lifetimeEarnings: safeNumber(data.lifetimeEarnings, 0),
          lastSaveTime: safeNumber(data.lastSaveTime, Date.now()),
        }
        const { energy, lifetimeEarnings } = simulateOfflineProgress(sanitized, Date.now())
        set({
          energy: safeNumber(energy, sanitized.energy),
          lifetimeEarnings: safeNumber(lifetimeEarnings, sanitized.lifetimeEarnings),
          lastSaveTime: Date.now(),
          lastTickTime: Date.now(),
        })
      },
}))

let saveInterval: ReturnType<typeof setInterval> | null = null

export function startGameLoop() {
  const store = useGameStore.getState()
  store.loadGame()
  const saved = load()
  if (saved && saved.lastSaveTime < Date.now() - 1000) {
    store.applyOffline()
  }
  if (saveInterval) clearInterval(saveInterval)
  saveInterval = setInterval(() => {
    const state = useGameStore.getState()
    save({
      energy: state.energy,
      counts: state.counts,
      essence: state.essence,
      lifetimeEarnings: state.lifetimeEarnings,
      lastSaveTime: state.lastSaveTime,
    })
  }, SAVE_INTERVAL_MS)
}

export function stopGameLoop() {
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
  }
}
