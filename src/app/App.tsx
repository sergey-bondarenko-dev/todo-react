import TaskPage from "@/pages/TaskPage";
import TasksPage from "@/pages/TasksPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BASE_URL } from "@/shared/constants";
import './styles';

const App = () => {  
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
