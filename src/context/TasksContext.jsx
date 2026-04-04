import { createContext, useState, useMemo, useCallback, useRef, useEffect } from "react";

export const TasksContext = createContext({}); 

export const TasksProvider = (props) => {
    const {
        children,
    } = props;

    const TASK_STORAGE_KEY = 'tasks';

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
    const [tasks, setTasks] = useState(() => {
        const data = localStorage.getItem(TASK_STORAGE_KEY);
        if (!data) {
            return initialTasks;
        }

        try {
            return JSON.parse(data);
        } catch {
            return initialTasks;
        }
    });
    const [query, setQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const newTaskTitleInputRef = useRef(null);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            return task.title.toLowerCase().includes(query.trim().toLowerCase())
        })
    }, [tasks, query]);

    const firstIncompleteTaskRef = useRef(null);
    const firstIncompleteTaskId = filteredTasks.find((task) => !task.isDone)?.id;

    useEffect(() => {
        newTaskTitleInputRef.current?.focus();
    }, []);

    useEffect(() => {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
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

    const scrollToFirstIncompleteTask = () => {
        firstIncompleteTaskRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }

    return (
        <TasksContext.Provider
            value={{
                tasks,
                filteredTasks,
                firstIncompleteTaskId,
                firstIncompleteTaskRef,
                deleteTask,
                deleteAllTasks,
                toggleTaskComplete,
                scrollToFirstIncompleteTask,
                newTaskTitle,
                setNewTaskTitle,
                query,
                setQuery,
                newTaskTitleInputRef,
                addTask,
            }}    
        >
            {children}
        </TasksContext.Provider>
    );
}