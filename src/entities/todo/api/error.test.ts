import { describe, expect, it } from 'vitest';
import { StorageError } from '@/shared/errors/StorageError';
import { normalizeTasksApiError } from './error';

describe('normalizeTasksApiError', () => {
  it('normalizes a storage error', () => {
    const error = new StorageError('quota-exceeded');

    expect(normalizeTasksApiError(error)).toEqual({
      type: 'storage',
      reason: 'quota-exceeded',
      message: 'Unable to write to localStorage',
    });
  });
});
