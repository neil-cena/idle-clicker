import { useGameLoop } from './hooks/useGameLoop'
import { MainView } from './components/MainView'
import './styles/global.css'

function App() {
  useGameLoop()

  return (
    <div className="app">
      <h1>Idle Incremental</h1>
      <MainView />
    </div>
  )
}

export default App
