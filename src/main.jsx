import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RecorderProvider } from './RecorderContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <RecorderProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RecorderProvider>
)
