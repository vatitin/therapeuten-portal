import '@mantine/core/styles.css';
import { AppRoutes } from './AppRoutes';
import { BrowserRouter, Router } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
