import { requestJson, requestVoid } from "@/shared/utils/request";
import type { Task, TasksApi } from "./type";
import { HttpError } from "@/shared/errors/HttpError";

const URL = 'http://localhost:3001/tasks';
const headers = {
    'Content-Type': 'application/json',
};

const serverApi: TasksApi = {
    getAll: () => {
        return requestJson<Task[]>(URL);
    },
    getById: async (taskId) => {
        try {
            return await requestJson<Task>(`${URL}/${taskId}`);
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                return null;
            }

            throw error;
        }
    },
    delete: async (taskId) => {
        return requestVoid(`${URL}/${taskId}`, {
            method: 'DELETE',
        });
    },
    deleteAll: async (tasks) => {
        await Promise.all(tasks.map((task) => {
            return serverApi.delete(task.id);
        }));
    },
    toggleComplete: (taskId, isDone) => {
        return requestVoid(`${URL}/${taskId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ isDone }),
        });
    },
    add: (title) => {
        return requestJson<Task>(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title,
                isDone: false,
            }),
        });
    },
};

export default serverApi;
