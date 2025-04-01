import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { useAuthProvider } from "./auth/hooks/AuthProvider.tsx";

const { AuthProvider } = useAuthProvider()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
