const STORAGE_KEY = 'tasks';

const read = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

const write = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const delay = (ms = 150) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const localAPI = {
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
    deleteAll: async (tasks) => {
        await delay();
        write([]);
    },
    toggleComplete: async (taskId, isDone) => {
        await delay();
        write(read().map((task) => task.id === taskId ? { ...task, isDone } : task ));
    },
    add: async (title) => {
        await delay();

        const newTask = {
            id: crypto?.randomUUID() ?? Date.now().toString(),
            title,
            isDone: false,
        }

        write([...read(), newTask]);

        return newTask;
    },
};

export default localAPI;