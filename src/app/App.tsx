import TaskPage from "@/pages/TaskPage";
import TasksPage from "@/pages/TasksPage";
import Router, { type Routes } from "./routing/Router";
import './styles';

const App = () => {
  const routes = {
    '/': TasksPage,
    '/tasks/:id': TaskPage,
    '*': () => <div>404 - Page Not Found</div>
  } satisfies Routes;
  
  return (
    <Router routes={routes} />
  );
}

export default App
