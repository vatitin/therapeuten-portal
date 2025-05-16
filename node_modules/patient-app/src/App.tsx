import { BrowserRouter } from "react-router-dom"
import { Navbar } from "./pages/Navbar"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar />
      <div>    
        <h1>Patient App</h1>
        <p>Welcome to the Patient App!</p>
        <p>This is a simple React application.</p>
        <p>Feel free to explore and modify the code!</p>
        <p>Enjoy codinggg!</p>
      </div>
    </BrowserRouter>

    </>
  )
}

export default App
