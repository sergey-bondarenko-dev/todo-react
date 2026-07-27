import { HttpError } from '@/shared/errors/HttpError';

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

    if (error instanceof SyntaxError) {
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
