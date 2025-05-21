import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
  <StrictMode>
    <MantineProvider theme={{}} defaultColorScheme="auto" > 
      <App />
    </MantineProvider>
  </StrictMode>,
  </ReactKeycloakProvider>
)
