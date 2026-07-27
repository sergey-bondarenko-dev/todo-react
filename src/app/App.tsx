import TaskPage from "@/pages/TaskPage";
import TasksPage from "@/pages/TasksPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { BASE_URL } from "@/shared/constants";
import './styles';
import { Toaster } from "sonner";

const App = () => {  
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

      <Toaster 
        position="top-center"
        richColors
        closeButton
      />
    </BrowserRouter>
  );
}

export default App
