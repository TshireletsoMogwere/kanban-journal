import { Routes, Route } from "react-router-dom";
// import Affirmation from './components/Affirmation';
import TaskBoard from './components/TaskBoard';
// import Journal from './components/Journal';
import KanbanJournalLanding from "./pages/LandingPage";

function App() {
  return (
       <main className="">
      {/* <Affirmation /> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <TaskBoard /> */}
        {/* <Journal /> */}
</div>
         <Routes>
      <Route path="/" element={<KanbanJournalLanding />} />
        <Route path="/taskboard" element={<TaskBoard />} />
      </Routes>
     
    </main>
  );
}

export default App;
