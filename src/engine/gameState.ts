import { create } from 'zustand'
import { GENERATORS, getCost } from './generators'
import { load, save } from './saveLoad'

const SAVE_INTERVAL_MS = 5000

const initialCounts = () => Object.fromEntries(GENERATORS.map((g) => [g.id, 0]))

interface GameState {
  energy: number
  counts: Record<string, number>
  lastSaveTime: number
  lastTickTime: number
  tick: (now: number) => void
  click: () => void
  buy: (id: string) => void
  loadGame: () => void
}

export const useGameStore = create<GameState>()((set, get) => ({
      energy: 0,
      counts: initialCounts(),
      lastSaveTime: Date.now(),
      lastTickTime: Date.now(),

      tick(now: number) {
        const state = get()
        const dt = (now - state.lastTickTime) / 1000
        if (dt <= 0) return
        let rate = 0
        GENERATORS.forEach((g) => {
          const owned = state.counts[g.id] ?? 0
          rate += owned * g.productionPerUnit
        })
        const gained = rate * dt
        set({
          energy: state.energy + gained,
          lastTickTime: now,
        })
      },

      click() {
        set((s) => ({ energy: s.energy + 1 }))
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

      loadGame() {
        const data = load()
        if (!data) return
        set({
          energy: data.energy,
          counts: data.counts,
          lastSaveTime: data.lastSaveTime,
          lastTickTime: Date.now(),
        })
      },
}))

let saveInterval: ReturnType<typeof setInterval> | null = null

export function startGameLoop() {
  const store = useGameStore.getState()
  store.loadGame()
  if (saveInterval) clearInterval(saveInterval)
  saveInterval = setInterval(() => {
    const state = useGameStore.getState()
    save({
      energy: state.energy,
      counts: state.counts,
      essence: 0,
      lifetimeEarnings: 0,
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
