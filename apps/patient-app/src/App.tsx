import { BrowserRouter } from "react-router-dom"
import '@mantine/core/styles.css';
import { SearchMapPage } from "./components/SearchMapPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <SearchMapPage />
      </BrowserRouter>
    </>
  )
}

export default App
