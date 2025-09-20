import React, { useState } from 'react'
import GameCanvas from './GameCanvas.jsx'

export default function App() {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="app">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '8px 0' }}>Flappy React</h1>
        <p className="badge">Space / Click / Touch = flap</p>
        <div className="controls">
          <button className="secondary" onClick={() => setShowHelp(v => !v)}>{showHelp ? 'Hide' : 'Show'} Help</button>
        </div>
        {showHelp && (
          <div style={{ textAlign: 'left', maxWidth: 520, margin: '8px auto 0' }}>
            <ul>
              <li>Press Space / Click / Touch to flap.</li>
              <li>Avoid the pipes. Get 1 point for each pipe passed.</li>
              <li>Stretch goals included: parallax background, simple sprite animation, persistent high score.</li>
            </ul>
          </div>
        )}
      </div>
      <div className="card">
        <GameCanvas width={360} height={520} />
      </div>
    </div>
  )
}