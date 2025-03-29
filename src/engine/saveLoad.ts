const SAVE_KEY = 'idle-incremental-save'

export interface SaveData {
  energy: number
  counts: Record<string, number>
  essence: number
  lifetimeEarnings: number
  lastSaveTime: number
}

export function load(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

export function save(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, lastSaveTime: Date.now() }))
  } catch {
    // ignore
  }
}
