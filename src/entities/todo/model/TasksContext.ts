import type { Task } from "@/shared/api/tasks/type";
import { createContext } from "react";

type TasksContextValue = {
    tasks: Task[],
    filteredTasks: Task[],
    deleteTask: (taskId: string) => void,
    deleteAllTasks: () => void,
    toggleTaskComplete: (taskId: string, isDone: boolean) => void,
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    newTaskTitleInputRef: React.RefObject<HTMLInputElement | null>,
    addTask: (title: string, afterCallback: () => void) => void,
    disappearingTaskId: string | null,
    appearingTaskId: string | null,
    firstIncompleteTaskId?: string,
    firstIncompleteTaskRef: React.RefObject<HTMLLIElement | null>,
    scrollToFirstIncompleteTask: () => void,
}

export const TasksContext = createContext<TasksContextValue | null>(null); 