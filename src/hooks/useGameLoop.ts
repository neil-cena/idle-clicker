import { useEffect, useRef } from 'react'
import { useGameStore, startGameLoop, stopGameLoop } from '../engine/gameState'

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick)
  const raf = useRef<number>(0)

  useEffect(() => {
    startGameLoop()
    function loop() {
      tick(Date.now())
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf.current)
      stopGameLoop()
    }
  }, [tick])
}
