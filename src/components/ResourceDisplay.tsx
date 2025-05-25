import { useState, useEffect, useRef } from 'react'
import { formatNumber } from '../utils/format'

interface ResourceDisplayProps {
  value: number
  className?: string
}

export function ResourceDisplay({ value, className }: ResourceDisplayProps) {
  const [display, setDisplay] = useState(value)
  const targetRef = useRef(value)

  useEffect(() => {
    targetRef.current = value
  }, [value])

  useEffect(() => {
    let raf = 0
    function tick() {
      setDisplay((d) => {
        const target = targetRef.current
        const diff = target - d
        if (Math.abs(diff) < 0.01) return target
        return d + diff * 0.15
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <span className={className}>{formatNumber(Math.floor(display))}</span>
}
