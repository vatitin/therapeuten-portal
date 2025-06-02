import { BrowserRouter, Router, Routes } from "react-router-dom"
import { Map } from "./components/Map"
import { HeaderSearch } from "./components/HeaderSearch"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <HeaderSearch />

      </Routes>

    </Router>

    </>
  )
}

export default App
