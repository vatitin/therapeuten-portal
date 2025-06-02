// App.tsx
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import { AppRoutes } from './AppRoutes';
import { HeaderSearch } from './components/common/HeaderSearch';

function App() {
  return (
    <div className="App">
            <HeaderSearch />
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
