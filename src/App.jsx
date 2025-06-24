
import './App.css'
import { Routes, Route } from "react-router-dom";
import KanbanJournalLanding from "./pages/LandingPage";
import TaskBoard from './components/TaskBoard';

function App() {


  return (
    <>
       <Routes>
      <Route path="/" element={<KanbanJournalLanding />} />
        <Route path="/taskboard" element={<TaskBoard />} />
      </Routes>
    </>
  )
}

export default App
