import { useState } from 'react'
import './styles/global.css'

function App() {
  const [energy, setEnergy] = useState(0)

  return (
    <div className="app">
      <h1>Idle Incremental</h1>
      <p className="energy">Energy: {energy}</p>
      <button type="button" className="btn-gather" onClick={() => setEnergy(e => e + 1)}>
        Gather
      </button>
    </div>
  )
}

export default App
