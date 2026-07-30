import { isTask } from "./isTask";
import type { Task, TasksApi } from "./type";

const STORAGE_KEY = 'tasks';

const read = (): Task[] => {
    try {
        const parsedData: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        if (!Array.isArray(parsedData)) {
            return [];
        }

        return parsedData.filter(isTask);
    } catch {
        return [];
    }
}

const write = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const delay = (ms = 150) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const localAPI: TasksApi = {
    getAll: async () => {
        await delay();
        return read();
    },
    getById: async (taskId) => {
        await delay();
        return read().find((task) => task.id === taskId) ?? null;
    },
    delete: async (taskId) => {
        await delay();
        write(read().filter((task) => task.id !== taskId));
    },
    deleteAll: async () => {
        await delay();
        write([]);
    },
    toggleComplete: async (taskId, isDone) => {
        await delay();
        write(read().map((task) => task.id === taskId ? { ...task, isDone } : task ));
    },
    add: async (title) => {
        await delay();

        const newTask: Task = {
            id: crypto?.randomUUID() ?? Date.now().toString(),
            title,
            isDone: false,
        }

        write([...read(), newTask]);

        return newTask;
    },
};

export default localAPI;
