import { requestJson, requestVoid } from "@/shared/utils/request";
import type { TasksApi } from "./type";
import { HttpError } from "@/shared/errors/HttpError";
import { isTask } from "./isTask";
import { InvalidResponseError } from "@/shared/errors/InvalidResponseError";

const URL = 'http://localhost:3001/tasks';
const headers = {
    'Content-Type': 'application/json',
};

const serverApi: TasksApi = {
    getAll: async () => {
        const tasks = await requestJson(URL);

        if (!Array.isArray(tasks)) {
            throw new InvalidResponseError('Received tasks is incorrect');
        }

        if (!tasks.every(isTask)) {
            throw new InvalidResponseError('Received tasks is incorrect');
        }

        return tasks;
    },
    getById: async (taskId) => {
        try {
            const task = await requestJson(`${URL}/${taskId}`);

            if (isTask(task)) {
                return task;
            }

            throw new InvalidResponseError('Received task is incorrect');
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
    add: async (title) => {
        const task = await requestJson(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title,
                isDone: false,
            }),
        });

        if (!isTask(task)) {
            throw new InvalidResponseError('Received task is incorrect');
        }

        return task;
    },
};

export default serverApi;
