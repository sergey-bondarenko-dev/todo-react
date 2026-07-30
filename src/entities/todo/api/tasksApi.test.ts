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

  it('normalizes an invalid tasks response', async () => {
    const serverTasks = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: true,
      },
      {
        id: '2',
        title: 'Learn React',
        isDone: 'on',
      },
    ];

    setupGetTasksHandler(
      () => HttpResponse.json(serverTasks),
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

  it('updates the active task list after adding without refetching', async () => {
    let finishAdd!: () => void;

    const addBarrier = new Promise<void>((resolve) => {
      finishAdd = resolve;
    });

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

    let getRequestCount = 0;

    setupGetTasksHandler(() => {
      getRequestCount += 1;

      return HttpResponse.json(tasks);
    });

    server.use(
      http.post(
        'http://localhost:3001/tasks',
        async () => {
          await addBarrier;

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
        expect(selectTasks(store.getState()).data).toEqual(tasks);

        finishAdd();
        await addRequest.unwrap();

        await expect.poll(
          () => selectTasks(store.getState()).data,
        ).toEqual([tasks[0], createdTask]);

        expect(getRequestCount).toBe(1);
      } finally {
        finishAdd();
        await addRequest;
        addRequest.reset();
      }
    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }
  });

  it('optimistically updates the task list before the mutation completes', async () => {
    let finishToggle!: () => void;

    const toggleBarrier = new Promise<void>((resolve) => {
      finishToggle = resolve;
    });

    const serverTasks = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: false,
      }
    ];

    setupGetTasksHandler(() => HttpResponse.json(serverTasks));

    server.use(
      http.patch(
        'http://localhost:3001/tasks/:id',
        async () => {
          await toggleBarrier;

          serverTasks[0].isDone = true;

          return new HttpResponse(null, { status: 204 });
        }
      ),
    );

    const store = createTestStore();

    const request = store.dispatch(tasksApi.endpoints.getTasks.initiate());

    try {
      const tasks = await request.unwrap();
      expect(tasks[0].isDone).toBe(false);

      const toggleRequest = store.dispatch(
        tasksApi.endpoints.toggleCompleteTask.initiate({ id: '1', isDone: true }),
      );

      try {
        const selectTasks = tasksApi.endpoints.getTasks.select();
        expect(selectTasks(store.getState()).data![0].isDone).toBe(true);
      } finally {
        finishToggle();

        try {
          await toggleRequest.unwrap();
        } finally {
          toggleRequest.reset();
        }
      }

    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }

  });

  it('rolls back the optimistic task list update when the mutation fails', async () => {
    const serverTasks = [
      {
        id: '1',
        title: 'Buy milk',
        isDone: false,
      }
    ];

    setupGetTasksHandler(() => HttpResponse.json(serverTasks));

    server.use(
      http.patch(
        'http://localhost:3001/tasks/:id',
        () => {
          return HttpResponse.json({}, { status: 500 });
        }
      ),
    );

    const store = createTestStore();

    const request = store.dispatch(tasksApi.endpoints.getTasks.initiate());

    try {
      const tasks = await request.unwrap();
      expect(tasks[0].isDone).toBe(false);

      const toggleRequest = store.dispatch(
        tasksApi.endpoints.toggleCompleteTask.initiate({ id: '1', isDone: true }),
      );

      const selectTasks = tasksApi.endpoints.getTasks.select();

      try {
        expect(
          selectTasks(store.getState()).data?.[0].isDone,
        ).toBe(true);

        await expect(toggleRequest.unwrap()).rejects.toEqual({
          type: 'http',
          status: 500,
          message: 'Request failed with status 500',
        });

        await expect.poll(
          () => selectTasks(store.getState()).data?.[0].isDone,
        ).toBe(false);
      } finally {
        await toggleRequest;
        toggleRequest.reset();
      }

    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }
  });

  it('optimistically updates the task detail before the mutation completes', async () => {
    let finishToggle!: () => void;

    const toggleBarrier = new Promise<void>((resolve) => {
      finishToggle = resolve;
    });

    let serverTask = {
      id: '1',
      title: 'Buy milk',
      isDone: false,
    };

    server.use(
      http.get(
        'http://localhost:3001/tasks/:id',
        () => HttpResponse.json(serverTask),
      ),
      http.patch(
        'http://localhost:3001/tasks/:id',
        async () => {
          await toggleBarrier;

          serverTask = {
            ...serverTask,
            isDone: true,
          };

          return new HttpResponse(null, { status: 204 });
        }
      ),
    );

    const store = createTestStore();

    const request = store.dispatch(tasksApi.endpoints.getTaskById.initiate('1'));

    try {
      const task = await request.unwrap();
      expect(task?.isDone).toBe(false);

      const toggleRequest = store.dispatch(
        tasksApi.endpoints.toggleCompleteTask.initiate({ id: '1', isDone: true }),
      );

      try {
        const selectTask = tasksApi.endpoints.getTaskById.select('1');
        expect(selectTask(store.getState()).data?.isDone).toBe(true);
      } finally {
        finishToggle();

        try {
          await toggleRequest.unwrap();
        } finally {
          toggleRequest.reset();
        }
      }

    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }

  });

  it('rolls back the optimistic task detail update when the mutation fails', async () => {
    const serverTask = {
      id: '1',
      title: 'Buy milk',
      isDone: false,
    };

    server.use(
      http.get(
        'http://localhost:3001/tasks/:id',
        () => HttpResponse.json(serverTask),
      ),
      http.patch(
        'http://localhost:3001/tasks/:id',
        () => {
          return HttpResponse.json({}, { status: 500 });
        }
      ),
    );

    const store = createTestStore();

    const request = store.dispatch(tasksApi.endpoints.getTaskById.initiate('1'));

    try {
      const task = await request.unwrap();
      expect(task?.isDone).toBe(false);

      const toggleRequest = store.dispatch(
        tasksApi.endpoints.toggleCompleteTask.initiate({ id: '1', isDone: true }),
      );

      const selectTask = tasksApi.endpoints.getTaskById.select('1');

      try {
        expect(
          selectTask(store.getState()).data?.isDone,
        ).toBe(true);

        await expect(toggleRequest.unwrap()).rejects.toEqual({
          type: 'http',
          status: 500,
          message: 'Request failed with status 500',
        });

        await expect.poll(
          () => selectTask(store.getState()).data?.isDone,
        ).toBe(false);
      } finally {
        await toggleRequest;
        toggleRequest.reset();
      }

    } finally {
      request.unsubscribe();
      store.dispatch(tasksApi.util.resetApiState());
    }
  });
});
