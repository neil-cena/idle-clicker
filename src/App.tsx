import { useState, useEffect } from 'react'
import { useGameLoop } from './hooks/useGameLoop'
import { useAudio } from './hooks/useAudio'
import { MainView } from './components/MainView'
import { PrestigePanel } from './components/PrestigePanel'
import { UpgradePanel } from './components/UpgradePanel'
import { OfflineModal } from './components/OfflineModal'
import { SettingsPanel } from './components/SettingsPanel'
import { ParticleEffect } from './components/ParticleEffect'

function App() {
  useGameLoop()
  const { playClick, playBuy } = useAudio()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shake, setShake] = useState(false)
  const [particleTrigger, setParticleTrigger] = useState(0)

  useEffect(() => {
    if (!shake) return
    const t = setTimeout(() => setShake(false), 120)
    return () => clearTimeout(t)
  }, [shake])

  return (
    <div className={`app theme-dark${shake ? ' shake' : ''}`}>
      <header className="app-header">
        <h1>Idle Incremental</h1>
        <button
          type="button"
          className="btn-icon"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>
      <OfflineModal />
      <main className="app-main">
        <MainView playClick={playClick} playBuy={playBuy} />
        <PrestigePanel
          onPrestige={() => {
            setShake(true)
            setParticleTrigger((p) => p + 1)
          }}
        />
        <UpgradePanel />
      </main>
      <ParticleEffect trigger={particleTrigger} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
