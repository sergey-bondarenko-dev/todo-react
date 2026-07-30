import { isTasksApiError } from '../api/error';

export const getTasksErrorMessage = (
    error: unknown,
    fallback = 'Something went wrong',
) => {
    if (!isTasksApiError(error)) {
        return fallback;
    }

    switch (error.type) {
        case 'network':
            return 'Unable to connect to the server';

        case 'invalid-response':
            return 'The server returned an invalid response';

        case 'http':
            return error.status >= 500
                ? 'The server is temporarily unavailable'
                : fallback;

        case 'storage':
            return error.reason === 'quota-exceeded'
                ? 'Browser storage is full'
                : 'Unable to save tasks in this browser';

        case 'unknown':
            return fallback;
    }
};
