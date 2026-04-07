import { createContext } from "react";
import useTasks from "./useTasks";
import useIncompleteTaskScroll from "./useIncompleteTaskScroll";

export const TasksContext = createContext({}); 

export const TasksProvider = (props) => {
    const {
        children,
    } = props;

    const {
        tasks,
        filteredTasks,
        deleteTask,
        deleteAllTasks,
        toggleTaskComplete,
        newTaskTitle,
        setNewTaskTitle,
        query,
        setQuery,
        newTaskTitleInputRef,
        addTask,
        disappearingTaskId,
        appearingTaskId
    } = useTasks();

    const {
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
        scrollToFirstIncompleteTask,
    } = useIncompleteTaskScroll(filteredTasks);

    return (
        <TasksContext.Provider
            value={{
                tasks,
                filteredTasks,
                deleteTask,
                deleteAllTasks,
                toggleTaskComplete,
                newTaskTitle,
                setNewTaskTitle,
                query,
                setQuery,
                newTaskTitleInputRef,
                addTask,
                disappearingTaskId,
                appearingTaskId,

                firstIncompleteTaskId,
                firstIncompleteTaskRef,
                scrollToFirstIncompleteTask,
            }}    
        >
            {children}
        </TasksContext.Provider>
    );
}