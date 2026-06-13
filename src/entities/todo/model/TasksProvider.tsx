import { useMemo, type ReactNode } from 'react';
import useTasks from './useTasks';
import useIncompleteTaskScroll from './useIncompleteTaskScroll';
import { TasksContext } from './TasksContext';

type TasksProviderProps = {
    children: ReactNode;
}

export const TasksProvider = (props: TasksProviderProps) => {
    const {
        children,
    } = props;

    const {
        tasks,
        filteredTasks,
        deleteTask,
        deleteAllTasks,
        toggleTaskComplete,
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

    const value = useMemo(() => ({
        tasks,
        filteredTasks,
        deleteTask,
        deleteAllTasks,
        toggleTaskComplete,
        query,
        setQuery,
        newTaskTitleInputRef,
        addTask,
        disappearingTaskId,
        appearingTaskId,
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
        scrollToFirstIncompleteTask,
    }), [
        tasks,
        filteredTasks,
        deleteTask,
        deleteAllTasks,
        toggleTaskComplete,
        query,
        setQuery,
        newTaskTitleInputRef,
        addTask,
        disappearingTaskId,
        appearingTaskId,
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
        scrollToFirstIncompleteTask,
    ]);

    return (
        <TasksContext.Provider
            value={value}    
        >
            {children}
        </TasksContext.Provider>
    );
}