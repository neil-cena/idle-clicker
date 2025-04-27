import { create } from 'zustand'
import { GENERATORS, getCost, getMilestoneMultiplier } from './generators'
import { essenceFromLifetimeEarnings, productionMultiplierFromEssence } from './prestige'
import { load, save } from './saveLoad'
import { simulateOfflineProgress } from './offline'

const SAVE_INTERVAL_MS = 5000

const initialCounts = () => Object.fromEntries(GENERATORS.map((g) => [g.id, 0]))

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
        const dt = (now - state.lastTickTime) / 1000
        if (dt <= 0) return
        let rate = 0
        GENERATORS.forEach((g) => {
          const owned = state.counts[g.id] ?? 0
          rate += (owned * g.productionPerUnit) * getMilestoneMultiplier(owned)
        })
        const mult = productionMultiplierFromEssence(state.essence)
        const gained = rate * dt * mult
        set({
          energy: state.energy + gained,
          lifetimeEarnings: state.lifetimeEarnings + gained,
          lastTickTime: now,
        })
      },

      click() {
        const mult = productionMultiplierFromEssence(get().essence)
        set((s) => ({ energy: s.energy + 1 * mult, lifetimeEarnings: s.lifetimeEarnings + 1 * mult }))
      },

      buy(id: string) {
        const def = GENERATORS.find((g) => g.id === id)
        if (!def) return
        const state = get()
        const owned = state.counts[id] ?? 0
        const cost = getCost(def, owned)
        if (state.energy < cost) return
        set((s) => ({
          energy: s.energy - cost,
          counts: { ...s.counts, [id]: (s.counts[id] ?? 0) + 1 },
        }))
      },

      prestige() {
        const state = get()
        const newEssence = essenceFromLifetimeEarnings(state.lifetimeEarnings)
        if (newEssence <= state.essence) return
        set({
          energy: 0,
          counts: initialCounts(),
          essence: state.essence + newEssence,
          lifetimeEarnings: 0,
          lastSaveTime: Date.now(),
        })
      },

      loadGame() {
        const data = load()
        if (!data) return
        set({
          energy: data.energy,
          counts: data.counts,
          essence: data.essence,
          lifetimeEarnings: data.lifetimeEarnings,
          lastSaveTime: data.lastSaveTime,
          lastTickTime: Date.now(),
        })
      },

      applyOffline() {
        const data = load()
        if (!data) return
        const { energy, lifetimeEarnings } = simulateOfflineProgress(data, Date.now())
        set({
          energy,
          lifetimeEarnings,
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
