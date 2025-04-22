import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/authContext.tsx'
import TokenRefresher from './tokens/refreshToken.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TokenRefresher />
      <App />
    </AuthProvider>
  </StrictMode>,
)
