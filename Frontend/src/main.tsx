import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import NavigationController from './components/nav/NavigationController.tsx'
import AuthProvider from './components/auth/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
         <NavigationController>
          <App />
        </NavigationController>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)
