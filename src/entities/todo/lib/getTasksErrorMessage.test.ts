import { describe, expect, it } from 'vitest';
import type { TasksApiError } from '../api/error';
import { getTasksErrorMessage } from './getTasksErrorMessage';

describe('getTasksErrorMessage', () => {
  it.each<{
    reason: Extract<TasksApiError, { type: 'storage' }>['reason'];
    expectedMessage: string;
  }>([
    {
      reason: 'quota-exceeded',
      expectedMessage: 'Browser storage is full',
    },
    {
      reason: 'unavailable',
      expectedMessage: 'Unable to save tasks in this browser',
    },
  ])(
    'returns a message for the $reason storage error',
    ({ reason, expectedMessage }) => {
      expect(getTasksErrorMessage({
        type: 'storage',
        reason,
        message: 'Unable to write to localStorage',
      })).toBe(expectedMessage);
    },
  );
});
