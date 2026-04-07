const useTasksLocalStorage = () => {
    const TASK_STORAGE_KEY = 'tasks';

    const getSavedTasks = () => {
        const data = localStorage.getItem(TASK_STORAGE_KEY);
        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    const saveTasks = (tasks) => {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }

    return {
        savedTasks: getSavedTasks(),
        saveTasks,
    }
}

export default useTasksLocalStorage;