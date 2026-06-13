import { 
    useState,
    useMemo, 
    useCallback, 
    useRef, 
    useEffect,
    useReducer,
} from "react";
import tasksApi from "@/shared/api/tasks";
import type { Task } from "@/shared/api/tasks/type";

type TasksAction =
    | { type: 'SET_ALL'; tasks: Task[] }
    | { type: 'ADD'; task: Task }
    | { type: 'TOGGLE_COMPLETE'; id: string; isDone: boolean }
    | { type: 'DELETE'; id: string }
    | { type: 'DELETE_ALL' };

const tasksReducer = (state: Task[], action: TasksAction) => {
    switch (action.type) {
        case 'SET_ALL': {
            return Array.isArray(action.tasks) ? action.tasks : state;
        }
        case 'ADD': {
            return [...state, action.task];
        }
        case 'TOGGLE_COMPLETE': {
            const { id, isDone } = action;

            return state.map((task) => {
                return task.id === id ? { ...task, isDone } : task;
            });
        }
        case 'DELETE': {
            return state.filter((task) => task.id !== action.id);
        }
        case 'DELETE_ALL': {
            return [];
        }
        default: {
            return state;
        }
    }
}

const useTasks = () => {
    const [tasks, dispatch] = useReducer(tasksReducer, []);
    const [query, setQuery] = useState('');
    const [disappearingTaskId, setDisappearingTaskId] = useState<string | null>(null);
    const [appearingTaskId, setAppearingTaskId] = useState<string | null>(null);

    const newTaskTitleInputRef = useRef<HTMLInputElement>(null);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            return task.title.toLowerCase().includes(query.trim().toLowerCase())
        })
    }, [tasks, query]);

    useEffect(() => {
        newTaskTitleInputRef.current?.focus();

        tasksApi.getAll()
            .then((tasks) => dispatch({ type: 'SET_ALL', tasks }));
    }, []);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        };

        tasksApi.deleteAll(tasks)
            .then(() => dispatch({ type: 'DELETE_ALL' }));
    }, [tasks]);

    const deleteTask = useCallback((taskId: string) => {
        tasksApi.delete(taskId)
            .then(() => {
                setDisappearingTaskId(taskId);
                setTimeout(() => {
                    dispatch({ type: 'DELETE', id: taskId });
                    setDisappearingTaskId(null);
                }, 400);
            });
    }, []);

    const toggleTaskComplete = useCallback((taskId: string, isDone: boolean) => {
        tasksApi.toggleComplete(taskId, isDone)
            .then(() => {
                dispatch({ type: 'TOGGLE_COMPLETE', id: taskId, isDone })
            });
    }, []);

    const addTask = useCallback((title: string, afterCallback: () => void) => {
        if (title.length <= 0) {
            return;
        }

        tasksApi.add(title)
            .then((addedTask) => {
                dispatch({ type: 'ADD', task: addedTask });
                afterCallback();
                setQuery('');
                newTaskTitleInputRef.current?.focus();
                setAppearingTaskId(addedTask.id);
                setTimeout(() => {
                    setAppearingTaskId(null);
                }, 400);
            });
    }, []);

    return {
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
    }
}

export default useTasks;