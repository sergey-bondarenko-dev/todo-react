const URL = 'http://localhost:3001/tasks';
const headers = {
    'Content-Type': 'application/json',
};

const serverApi = {
    getAll: () => {
        return fetch(URL)
            .then((response) => response.json());
    },
    getById: (taskId) => {
        return fetch(`${URL}/${taskId}`)
            .then((response) => response.json());
    },
    delete: (taskId) => {
        return fetch(`${URL}/${taskId}`, {
            method: 'DELETE',
        });
    },
    deleteAll: (tasks) => {
        return Promise.all(tasks.map((task) => {
            return serverApi.delete(task.id);
        }));
    },
    toggleComplete: (taskId, isDone) => {
        return fetch(`${URL}/${taskId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ isDone }),
        })
        .then((response) => response.json());
    },
    add: (title) => {
        const newTask = {
            title,
            isDone: false,
        };

        return fetch(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(newTask),
        })
        .then((response) => response.json());
    },
};

export default serverApi;