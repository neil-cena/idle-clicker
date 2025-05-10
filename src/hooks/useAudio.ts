import { useRef } from 'react'
import { Howl } from 'howler'

function createHowl(src: string, volume: number): Howl | null {
  try {
    const h = new Howl({ src: [src], volume, onloaderror: () => {} })
    return h
  } catch {
    return null
  }
}

export function useAudio() {
  const clickRef = useRef<Howl | null>(null)
  const buyRef = useRef<Howl | null>(null)

  function playClick() {
    try {
      if (!clickRef.current) clickRef.current = createHowl('/sounds/click.mp3', 0.3)
      if (clickRef.current) {
        clickRef.current.rate(0.9 + Math.random() * 0.2)
        clickRef.current.play()
      }
    } catch {
      // no audio
    }
  }

  function playBuy() {
    try {
      if (!buyRef.current) buyRef.current = createHowl('/sounds/purchase.mp3', 0.3)
      if (buyRef.current) buyRef.current.play()
    } catch {
      // no audio
    }
  }

  return { playClick, playBuy }
}
