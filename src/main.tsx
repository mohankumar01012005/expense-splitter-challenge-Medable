// src/main.tsx (or index.tsx) — replace with this exact code
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppProvider } from './state'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '14px',
        },
      }}
    />
  </AppProvider>
)
