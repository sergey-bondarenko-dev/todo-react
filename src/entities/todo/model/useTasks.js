import { 
    useState,
    useMemo, 
    useCallback, 
    useRef, 
    useEffect,
    useReducer,
} from "react";
import tasksApi from "@/shared/api/tasks";

const tasksReducer = (state, action) => {
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
    const [disappearingTaskId, setDisappearingTaskId] = useState(null);
    const [appearingTaskId, setAppearingTaskId] = useState(null);

    const newTaskTitleInputRef = useRef(null);

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
        if (!isConfirmed) return;

        tasksApi.deleteAll(tasks)
            .then(() => dispatch({ type: 'DELETE_ALL' }));
    }, [tasks]);

    const deleteTask = useCallback((taskId) => {
        tasksApi.delete(taskId)
            .then(() => {
                setDisappearingTaskId(taskId);
                setTimeout(() => {
                    dispatch({ type: 'DELETE', id: taskId });
                    setDisappearingTaskId(null);
                }, 400);
            });
    }, []);

    const toggleTaskComplete = useCallback((taskId, isDone) => {
        tasksApi.toggleComplete(taskId, isDone)
            .then(() => {
                dispatch({ type: 'TOGGLE_COMPLETE', id: taskId, isDone })
            });
    }, []);

    const addTask = useCallback((title, afterCallback) => {
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