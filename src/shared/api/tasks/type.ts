export type Task = {
    id: string;
    title: string;
    isDone: boolean;
}

export type TasksApi = {
    getAll: () => Promise<Task[]>;
    getById: (taskId: string) => Promise<Task | null>;
    delete: (taskId: string) => Promise<void>;
    deleteAll: (tasks: Task[]) => Promise<void>;
    toggleComplete: (taskId: string, isDone: boolean) => Promise<void>;
    add: (title: string) => Promise<Task>; 
}