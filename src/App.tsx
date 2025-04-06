import { useGameLoop } from './hooks/useGameLoop'
import { MainView } from './components/MainView'

function App() {
  useGameLoop()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Idle Incremental</h1>
      </header>
      <main className="app-main">
        <MainView />
      </main>
    </div>
  )
}

export default App
