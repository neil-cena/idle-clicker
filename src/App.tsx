import { useGameLoop } from './hooks/useGameLoop'
import { MainView } from './components/MainView'
import { PrestigePanel } from './components/PrestigePanel'
import { UpgradePanel } from './components/UpgradePanel'
import { OfflineModal } from './components/OfflineModal'

function App() {
  useGameLoop()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Idle Incremental</h1>
      </header>
      <OfflineModal />
      <main className="app-main">
        <MainView />
        <PrestigePanel />
        <UpgradePanel />
      </main>
    </div>
  )
}

export default App
