import { BrowserRouter } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Map } from "./components/Map"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar />
      <div>    
        <h1>Patient App</h1>
        <p>Welcome to the Patient App!</p>
      </div>
      <Map />
    </BrowserRouter>

    </>
  )
}

export default App
