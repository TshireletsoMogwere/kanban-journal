import logo from './logo.svg';
import Affirmation from './components/Affirmation';
import TaskBoard from './components/TaskBoard';
import Journal from './components/Journal';

function App() {
  return (
       <main className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Kanban Journal</h1>
      <Affirmation />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskBoard />
        <Journal />
      </div>
    </main>
  );
}

export default App;
