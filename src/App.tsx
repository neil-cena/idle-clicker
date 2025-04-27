import { useGameLoop } from './hooks/useGameLoop'
import { MainView } from './components/MainView'
import { PrestigePanel } from './components/PrestigePanel'
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
      </main>
    </div>
  )
}

export default App
