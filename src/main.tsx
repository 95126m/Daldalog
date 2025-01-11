import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeApp } from 'firebase/app'

initializeApp({
  apiKey: 'AIzaSyBFxp8pCDxeMWJwFs_xd2qL73ONnjaGjLU',
  authDomain: 'daldalog.firebaseapp.com',
  projectId: 'daldalog',
  storageBucket: 'daldalog.firebasestorage.app',
  messagingSenderId: '945032510408',
  appId: '1:945032510408:web:b780068e38e40386d79efd',
  measurementId: 'G-96E83EW0Y7'
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
