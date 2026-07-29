// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import localAPI from "./local";

const jsdomInstance = (
  globalThis as typeof globalThis & {
    jsdom?: {
      window: {
        localStorage: Storage;
      };
    };
  }
).jsdom;

if (jsdomInstance) {
  vi.stubGlobal(
    'localStorage',
    jsdomInstance.window.localStorage,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('local', () => {
  it('returns tasks stored in localStorage', async () => {
    const tasks = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: false,
      },
    ];

    window.localStorage.setItem('tasks', JSON.stringify(tasks));

    const result = await runWithFakeTimers(() => localAPI.getAll());

    expect(result).toEqual(tasks);
  });

  it('returns empty array when localStorage contains invalid json', async () => {
    window.localStorage.setItem('tasks', "{broken json}");

    const result = await runWithFakeTimers(() => localAPI.getAll());

    expect(result).toEqual([]);
  });

  it('adds a task and persists it', async () => {
    const createdTask = await runWithFakeTimers(() => localAPI.add('Buy milk'));

    expect(createdTask).toEqual({
      id: expect.any(String),
      title: 'Buy milk',
      isDone: false,
    });

    const tasks = await runWithFakeTimers(() => localAPI.getAll());

    expect(tasks).toEqual([createdTask]);
  });

  it('returns an empty array when stored data is not an array', async () => {
    window.localStorage.setItem('tasks', 'null');

    const result = await runWithFakeTimers(
      () => localAPI.getAll(),
    );

    expect(result).toEqual([]);
  });

  it('filters out invalid tasks from stored data', async () => {
    const validTask = {
      id: '1',
      title: 'Buy milk',
      isDone: false,
    };

    const invalidTask = {
      id: 2,
      title: null,
      isDone: 'no',
    };

    window.localStorage.setItem(
      'tasks',
      JSON.stringify([validTask, invalidTask]),
    );

    const result = await runWithFakeTimers(
      () => localAPI.getAll(),
    );

    expect(result).toEqual([validTask]);
  });
});

async function runWithFakeTimers<T>(operation: () => Promise<T>) {
  const resultPromise = operation();
  await vi.runAllTimersAsync();
  return resultPromise;
}
