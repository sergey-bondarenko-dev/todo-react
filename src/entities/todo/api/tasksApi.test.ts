import { HttpResponse, http, type JsonBodyType } from 'msw';
import { describe, expect, it } from "vitest";
import { tasksApi } from "./tasksApi";
import { server } from "@/test/mocks/server";
import { createTestStore } from '@/test/store';
import type { Task } from "@/shared/api/tasks/type";

const setupGetTasksHandler = (resolver: () => HttpResponse<JsonBodyType>) => {
  server.use(
    http.get(
      'http://localhost:3001/tasks',
      resolver,
    ),
  );
};

const runGetTasksQuery = async () => {
  const store = createTestStore();

  const request = store.dispatch(
    tasksApi.endpoints.getTasks.initiate(),
  );

  try {
    return await request.unwrap();
  } finally {
    request.unsubscribe();
    store.dispatch(tasksApi.util.resetApiState());
  }
};

const runGetTaskByIdQuery = async (id: string) => {
  const store = createTestStore();

  const request = store.dispatch(
    tasksApi.endpoints.getTaskById.initiate(id),
  );

  try {
    return await request.unwrap();
  } finally {
    request.unsubscribe();
    store.dispatch(tasksApi.util.resetApiState());
  }
};

const runAddTaskMutation = async (title: string) => {
  const store = createTestStore();

  const request = store.dispatch(
    tasksApi.endpoints.addTask.initiate(title),
  );

  try {
    return await request.unwrap();
  } finally {
    request.reset();
    store.dispatch(tasksApi.util.resetApiState());
  }
};

describe('tasksApi', () => {
  it('loads tasks from the server', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: false,
      },
    ];

    setupGetTasksHandler(() => HttpResponse.json(tasks));

    const result = await runGetTasksQuery();

    expect(result).toEqual(tasks);
  });

  it('normalizes HTTP errors from the server', async () => {
    setupGetTasksHandler(
      () => new HttpResponse(null, {
          status: 503,
      }),
    );

    await expect(runGetTasksQuery()).rejects.toEqual({
      type: 'http',
      status: 503,
      message: 'Request failed with status 503',
    });
  });

  it('normalizes an invalid JSON response', async () => {
    setupGetTasksHandler(
      () => new HttpResponse('{broken json', {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    await expect(runGetTasksQuery()).rejects.toEqual({
      type: 'invalid-response',
      message: 'Server returned an invalid response',
    });
  });

  it('returns null when a task does not exist', async () => {
    server.use(
      http.get(
        'http://localhost:3001/tasks/:id',
        () => new HttpResponse(null, {
          status: 404,
        }),
      ),
    );
    
    const result = await runGetTaskByIdQuery('missing');

    expect(result).toBeNull();
  });

  it('adds a task through the server', async () => {
    const createdTask: Task = {
      id: '1',
      title: 'Buy milk',
      isDone: false,
    };

    let receivedBody: unknown;

    server.use(
      http.post(
        'http://localhost:3001/tasks',
        async ({ request }) => {
          receivedBody = await request.json();

          return HttpResponse.json(createdTask, {
            status: 201,
          });
        },
      ),
    );

    const result = await runAddTaskMutation('Buy milk');

    expect(receivedBody).toEqual({
      title: 'Buy milk',
      isDone: false,
    });

    expect(result).toEqual(createdTask);
  });

  it('refetches the active task list after adding a task', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: false,
      },
    ];

    const createdTask: Task = {
      id: '2',
      title: 'Learn React',
      isDone: false,
    };

    let serverTasks = tasks;

    let getRequestCount = 0;

    setupGetTasksHandler(() => {
      getRequestCount += 1;

      return HttpResponse.json(serverTasks);
    });

    server.use(
      http.post(
        'http://localhost:3001/tasks',
        () => {
          serverTasks = [...serverTasks, createdTask];

          return HttpResponse.json(createdTask, {
            status: 201,
          });
        },
      ),
    );

    const store = createTestStore();

    const request = store.dispatch(
      tasksApi.endpoints.getTasks.initiate(),
    );

    try {
      await request.unwrap();

      expect(getRequestCount).toBe(1);

      const selectTasks =
        tasksApi.endpoints.getTasks.select();

      const queryState = selectTasks(store.getState());

      expect(queryState.data).toEqual(tasks);
      expect(queryState.isSuccess).toBe(true);

      const addRequest = store.dispatch(
        tasksApi.endpoints.addTask.initiate(
          createdTask.title,
        ),
      );

      try {
        await addRequest.unwrap();

        await expect.poll(
          () => selectTasks(store.getState()).data,
        ).toEqual([tasks[0], createdTask]);

        expect(getRequestCount).toBe(2);
      } finally {
        addRequest.reset();
      }
    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }
  });
});


