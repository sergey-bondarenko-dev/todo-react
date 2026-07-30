// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import localAPI from "./local";
import type { Task } from "./type";

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

const createTasks = (): Task[] => [
  {
    id: '1',
    title: 'Buy milk',
    isDone: false,
  },
  {
    id: '2',
    title: 'Learn React',
    isDone: false,
  },
];

const storeTasks = (tasks: Task[]) => {
  window.localStorage.setItem(
    'tasks',
    JSON.stringify(tasks),
  );
};

describe('local', () => {
  it('returns tasks stored in localStorage', async () => {
    const tasks = createTasks();
    storeTasks(tasks);

    const result = await runWithFakeTimers(() => localAPI.getAll());

    expect(result).toEqual(tasks);
  });

  it('returns empty array when localStorage contains invalid json', async () => {
    window.localStorage.setItem('tasks', "{broken json}");

    const result = await runWithFakeTimers(() => localAPI.getAll());

    expect(result).toEqual([]);
  });

  it('returns empty array when localStorage contains object', async () => {
    window.localStorage.setItem('tasks', JSON.stringify({}));

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

  it('updates completion state only for the selected task', async () => {
    const tasks = createTasks();
    storeTasks(tasks);

    await runWithFakeTimers(
      () => localAPI.toggleComplete('1', true),
    );

    const result = await runWithFakeTimers(
      () => localAPI.getAll(),
    );

    expect(result).toEqual([
      {
        id: '1',
        title: 'Buy milk',
        isDone: true,
      },
      {
        id: '2',
        title: 'Learn React',
        isDone: false,
      },
    ]);
  });

  it('deletes only the selected task', async () => {
    const tasks = createTasks();
    storeTasks(tasks);

    await runWithFakeTimers(
      () => localAPI.delete('1'),
    );

    const result = await runWithFakeTimers(
      () => localAPI.getAll(),
    );

    expect(result).toEqual([
      {
        id: '2',
        title: 'Learn React',
        isDone: false,
      },
    ]);
  });

  it('deletes all tasks', async () => {
    const tasks = createTasks();
    storeTasks(tasks);

    await runWithFakeTimers(
      () => localAPI.deleteAll(tasks),
    );

    const result = await runWithFakeTimers(
      () => localAPI.getAll(),
    );

    expect(result).toEqual([]);
  });

  it('returns a task by id or null when it does not exist', async () => {
    const tasks = createTasks();
    storeTasks(tasks);

    const existingTask = await runWithFakeTimers(
      () => localAPI.getById('2'),
    );

    const missingTask = await runWithFakeTimers(
      () => localAPI.getById('missing'),
    );

    expect(existingTask).toEqual(tasks[1]);
    expect(missingTask).toBeNull();
  });
});

async function runWithFakeTimers<T>(operation: () => Promise<T>) {
  const resultPromise = operation();
  await vi.runAllTimersAsync();
  return resultPromise;
}
