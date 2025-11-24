import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './api/keycloak.ts'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider 
  authClient={keycloak}     
  initOptions={{
      //onLoad: 'login-required',
  }}>
    <StrictMode>
      <MantineProvider theme={{}} defaultColorScheme="auto" > 
        <App />
      </MantineProvider>
    </StrictMode>
  </ReactKeycloakProvider>
)
