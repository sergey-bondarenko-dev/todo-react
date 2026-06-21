import { 
    useState,
    useMemo, 
    useCallback, 
    useRef, 
    useEffect,
} from "react";
import { 
    useAddTaskMutation, 
    useDeleteAllTasksMutation, 
    useDeleteTaskMutation, 
    useGetTasksQuery, 
    useToggleCompleteTaskMutation 
} from "../api";

const useTasks = () => {
    const { data: tasks } = useGetTasksQuery();
    const [query, setQuery] = useState('');
    const [disappearingTaskId, setDisappearingTaskId] = useState<string | null>(null);
    const [appearingTaskId, setAppearingTaskId] = useState<string | null>(null);

    const [add] = useAddTaskMutation();
    const [deleteById] = useDeleteTaskMutation();
    const [deleteAll] = useDeleteAllTasksMutation();
    const [toggleComplete] = useToggleCompleteTaskMutation();

    const newTaskTitleInputRef = useRef<HTMLInputElement>(null);

    const filteredTasks = useMemo(() => {
        if (!tasks) {
            return [];
        }
        
        return tasks.filter((task) => {
            return task.title.toLowerCase().includes(query.trim().toLowerCase())
        })
    }, [tasks, query]);

    useEffect(() => {
        newTaskTitleInputRef.current?.focus();
    }, []);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        };

        deleteAll(tasks ?? []);
    }, [tasks, deleteAll]);

    const deleteTask = useCallback((taskId: string) => {
        deleteById(taskId)
            .unwrap()
            .then(() => {
                setDisappearingTaskId(taskId);
                setTimeout(() => {
                    setDisappearingTaskId(null);
                }, 400);
            });
    }, [deleteById]);

    const toggleTaskComplete = useCallback((taskId: string, isDone: boolean) => {
        toggleComplete({ id: taskId, isDone });
    }, [toggleComplete]);

    const addTask = useCallback((title: string, afterCallback: () => void) => {
        if (title.length <= 0) {
            return;
        }

        add(title)
            .unwrap()
            .then((addedTask) => {       
                if (!addedTask) return;

                afterCallback();
                setQuery('');
                newTaskTitleInputRef.current?.focus();
                setAppearingTaskId(addedTask.id);
                setTimeout(() => {
                    setAppearingTaskId(null);
                }, 400);
            });
    }, [add]);

    return {
        tasks: tasks ?? [],
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
