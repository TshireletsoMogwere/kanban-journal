import logo from './logo.svg';
import Affirmation from './components/Affirmation';
import './index.css';
import TaskBoard from './components/TaskBoard';
function App() {
  return (
    <div className="bg-red">
     <Affirmation/>
     <TaskBoard/>
    </div>
  );
}

export default App;
