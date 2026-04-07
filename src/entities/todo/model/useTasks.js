import { 
    useState,
    useMemo, 
    useCallback, 
    useRef, 
    useEffect
} from "react";
import tasksApi from "@/shared/api/tasks";

const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [query, setQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
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
            .then((tasks) => setTasks(tasks));
    }, []);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) return;

        tasksApi.deleteAll(tasks)
            .then(() => setTasks([]));
    }, [tasks]);

    const deleteTask = useCallback((taskId) => {
        tasksApi.delete(taskId)
            .then(() => {
                setDisappearingTaskId(taskId);
                setTimeout(() => {
                    setTasks((tasks) => {
                        return tasks.filter((task) => task.id !== taskId);
                    });
                    setDisappearingTaskId(null);
                }, 400);
            });
    }, []);

    const toggleTaskComplete = useCallback((taskId, isDone) => {
        tasksApi.toggleComplete(taskId, isDone)
            .then(() => {
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
            });
    }, []);

    const addTask = useCallback((title) => {
        if (title.length <= 0) {
            return;
        }

        tasksApi.add(title)
            .then((addedTask) => {
                setTasks((tasks) =>  [...tasks, addedTask]);
                setNewTaskTitle('');
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
        newTaskTitle,
        setNewTaskTitle,
        query,
        setQuery,
        newTaskTitleInputRef,
        addTask,
        disappearingTaskId,
        appearingTaskId,
    }
}

export default useTasks;