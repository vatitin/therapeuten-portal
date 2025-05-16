import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import keycloak from './keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
  <StrictMode>
      <App />
  </StrictMode>,
  </ReactKeycloakProvider>
)
