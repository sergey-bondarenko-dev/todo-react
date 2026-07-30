import { HttpError } from '@/shared/errors/HttpError';
import { InvalidResponseError } from '@/shared/errors/InvalidResponseError';

export type TasksApiError =
  | {
      type: 'http';
      status: number;
      message: string;
  }
  | {
      type: 'network';
      message: string;
  }
  | {
      type: 'invalid-response';
      message: string;
  }
  | {
      type: 'unknown';
      message: string;
  };

export const normalizeTasksApiError = (
    error: unknown,
): TasksApiError => {
    if (error instanceof HttpError) {
        return {
            type: 'http',
            status: error.status,
            message: error.message,
        };
    }

    if (error instanceof TypeError) {
        return {
            type: 'network',
            message: 'Network request failed',
        };
    }

    if (error instanceof SyntaxError || error instanceof InvalidResponseError) {
        return {
            type: 'invalid-response',
            message: 'Server returned an invalid response',
        };
    }

    return {
        type: 'unknown',
        message: 'Unknown error',
    };
};

export const isTasksApiError = (
    error: unknown,
): error is TasksApiError => {
    if (
        typeof error !== 'object'
        || error === null
        || !('type' in error)
        || !('message' in error)
        || typeof error.message !== 'string'
    ) {
        return false;
    }

    if (error.type === 'http') {
        return (
            'status' in error
            && typeof error.status === 'number'
        );
    }

    return (
        error.type === 'network'
        || error.type === 'invalid-response'
        || error.type === 'unknown'
    );
};
