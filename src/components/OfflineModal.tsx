import { useState, useEffect } from 'react'
import { load } from '../engine/saveLoad'
import { useGameStore } from '../engine/gameState'
import { simulateOfflineProgress } from '../engine/offline'
import { formatNumber } from '../utils/format'

const MIN_OFFLINE_MS = 60000

export function OfflineModal() {
  const [show, setShow] = useState(false)
  const [gained, setGained] = useState(0)
  const applyOffline = useGameStore((s) => s.applyOffline)

  useEffect(() => {
    const data = load()
    if (!data) return
    const offline = Date.now() - data.lastSaveTime
    if (offline < MIN_OFFLINE_MS) return
    const { energy } = simulateOfflineProgress(data, Date.now())
    setGained(Math.max(0, energy - data.energy))
    setShow(true)
  }, [])

  function handleClose() {
    applyOffline()
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="modal-overlay" role="dialog">
      <div className="modal">
        <h3>Welcome back</h3>
        <p>You earned {formatNumber(gained)} energy while away.</p>
        <button type="button" onClick={handleClose}>
          Collect
        </button>
      </div>
    </div>
  )
}
