import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

if (typeof window !== 'undefined') {
  globalThis.global = window;  
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
