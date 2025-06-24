
import './App.css'
import { Routes, Route } from "react-router-dom";
import KanbanJournalLanding from "./pages/LandingPage";

function App() {


  return (
    <>
       <Routes>
      <Route path="/" element={<KanbanJournalLanding />} />
      </Routes>
    </>
  )
}

export default App
