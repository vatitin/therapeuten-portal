// App.tsx
import {
  BrowserRouter,
  BrowserRouter as Router,
} from 'react-router-dom';

import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
