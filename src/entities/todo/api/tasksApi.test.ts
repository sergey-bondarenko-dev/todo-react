import { configureStore } from "@reduxjs/toolkit";
import { HttpResponse, http, type JsonBodyType } from 'msw';
import { describe, expect, it } from "vitest";
import { tasksApi } from "./tasksApi";
import { server } from "@/test/mocks/server";
import type { Task } from "@/shared/api/tasks/type";

const createTestStore = () => configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(tasksApi.middleware)
  ),
});

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
});


