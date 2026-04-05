import { 
    useState,
    useMemo, 
    useCallback, 
    useRef, 
    useEffect
} from "react";
import useTasksLocalStorage from "./useTasksLocalStorage";

const useTasks = () => {
    const initialTasks = [
        {
            id: 'task-1',
            title: 'Task 1',
            isDone: true,
        },
        {
            id: 'task-2',
            title: 'Task 2',
            isDone: false,
        },
    ];

    const {
        savedTasks,
        saveTasks,
    } = useTasksLocalStorage();

    const [tasks, setTasks] = useState(savedTasks ?? initialTasks);
    const [query, setQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const newTaskTitleInputRef = useRef(null);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            return task.title.toLowerCase().includes(query.trim().toLowerCase())
        })
    }, [tasks, query]);

    useEffect(() => {
        newTaskTitleInputRef.current?.focus();
    }, []);

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) return;

        setTasks([]);
    }, []);

    const deleteTask = useCallback((taskId) => {
        setTasks((tasks) => {
            return tasks.filter((task) => task.id !== taskId);
        });
    }, []);

    const toggleTaskComplete = useCallback((taskId, isDone) => {
        setTasks((tasks) => {
            return tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        isDone,
                    }
                }

                return task;
            });
        });
    }, []);

    const addTask = useCallback(() => {
        if (newTaskTitle.trim().length <= 0) {
            return;
        }

        const newTask = {
            id: crypto?.randomUUID() ?? Date.now().toString(),
            title: newTaskTitle,
            isDone: false,
        }

        setTasks((tasks) =>  [...tasks, newTask]);
        setNewTaskTitle('');
        setQuery('');
        newTaskTitleInputRef.current?.focus();
    }, [newTaskTitle]);

    return {
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
    }
}

export default useTasks;