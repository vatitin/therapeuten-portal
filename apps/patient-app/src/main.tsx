import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import keycloak from './keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <StrictMode>
      <MantineProvider theme={{}} defaultColorScheme="auto" >
        <App />
      </MantineProvider>
    </StrictMode>
  </ReactKeycloakProvider>
)
