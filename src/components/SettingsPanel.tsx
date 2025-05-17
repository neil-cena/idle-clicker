import { useState } from 'react'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [soundOn, setSoundOn] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog">
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Settings</h3>
        <label>
          <input
            type="checkbox"
            checked={soundOn}
            onChange={(e) => setSoundOn(e.target.checked)}
          />
          Sound
        </label>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark mode
        </label>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
