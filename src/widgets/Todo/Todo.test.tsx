// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { server } from "@/test/mocks/server";
import type { Task } from "@/shared/api/tasks/type";
import { renderWithProviders } from "@/test/renderWithProviders";
import TaskPage from "@/pages/TaskPage";
import Todo from "./Todo";
import { screen, waitFor, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const tasks: Task[] = [
  {
    id: '1',
    title: 'Buy milk',
    isDone: false,
  },
  {
    id: '2',
    title: 'Learn React',
    isDone: true,
  },
];

const setupTasksHandler = () => {
  server.use(
    http.get(
      'http://localhost:3001/tasks',
      () => HttpResponse.json(tasks),
    ),
  );
};

describe('Todo', () => {
  it('renders tasks loaded from the server', async () => {
    setupTasksHandler();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>,
    );

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );

    expect(buyMilkCheckbox).toBeVisible();

    const learnReactCheckbox = screen.getByRole(
      'checkbox',
      {
        name: 'Learn React',
      },
    );

    expect(learnReactCheckbox).toBeVisible();
    expect(learnReactCheckbox).toBeChecked();
  });

  it('filters tasks by the search query', async () => {
    const user = userEvent.setup();

    setupTasksHandler();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>,
    );

    await screen.findByRole('checkbox', {
      name: 'Buy milk',
    });

    const searchInput = screen.getByRole(
      'searchbox',
      {
        name: 'Search task',
      },
    );

    await user.type(searchInput, 'react');

    await waitFor(() => {
      expect(
        screen.queryByRole('checkbox', {
          name: 'Buy milk',
        }),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('checkbox', {
        name: 'Learn React',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('React', {
        selector: 'mark',
      }),
    ).toBeVisible();
  });

  it('shows "No tasks" when server returned empty list', async () => {
    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json([]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const notFoundElement = await screen.findByText('No tasks');
    const button = screen.getByRole('button', { name: 'Show first incomplete task' });
    const listElement = screen.getByRole('list');

    expect(listElement.children.length).toBe(0);
    expect(notFoundElement).toBeVisible();
    expect(button).toBeDisabled();
  });

  it('shows "Not found" when no items match the search query', async () => {
    setupTasksHandler();

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    await screen.findByRole('checkbox', {
      name: 'Buy milk',
    });

    const searchInput = screen.getByRole(
      'searchbox',
      {
        name: 'Search task',
      },
    );

    await user.type(searchInput, '123');

    const notFoundElement = await screen.findByText('Not found');
    const button = screen.getByRole('button', { name: 'Show first incomplete task' });
    const listElement = screen.getByRole('list');

    await waitFor(() => expect(listElement.children.length).toBe(0));
    expect(notFoundElement).toBeVisible();
    expect(button).toBeDisabled();
  });

  it('shows an error message and a retry button when the initial load fails', async () => {
    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json({}, { status: 500 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const retryButton = await screen.findByRole('button', {
      name: 'Retry',
    });
    const errorMessageElement = screen.getByText('The server is temporarily unavailable');

    expect(retryButton).toBeVisible();
    expect(errorMessageElement).toBeVisible();
  });

  it('renders tasks loaded after retry', async () => {
    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json({}, { status: 500 }),
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const retryButton = await screen.findByRole('button', {
      name: 'Retry',
    });
    const errorMessageElement = screen.getByText('The server is temporarily unavailable');

    expect(retryButton).toBeVisible();
    expect(errorMessageElement).toBeVisible();

    setupTasksHandler();

    await user.click(retryButton);

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );

    expect(buyMilkCheckbox).toBeVisible();

    const learnReactCheckbox = screen.getByRole(
      'checkbox',
      {
        name: 'Learn React',
      },
    );

    expect(learnReactCheckbox).toBeVisible();
    expect(learnReactCheckbox).toBeChecked();
  });

  it('toggles task status when a checkbox is clicked', async () => {
    let serverTasks = tasks.slice();

    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json(serverTasks),
      ),

      http.patch(
        'http://localhost:3001/tasks/:id',
        async ({ params, request }) => {
          const body = await request.json() as {
            isDone: boolean;
          };

          serverTasks = serverTasks.map((task) => (
            task.id === params.id
              ? { ...task, isDone: body.isDone }
              : task
          ));

          return new HttpResponse(null, {
            status: 204,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );

    const learnReactCheckbox = screen.getByRole(
      'checkbox',
      {
        name: 'Learn React',
      },
    );

    await user.click(buyMilkCheckbox);

    await waitFor(() => {
      expect(buyMilkCheckbox).toBeChecked();
    });

    await user.click(learnReactCheckbox);

    await waitFor(() => {
      expect(learnReactCheckbox).not.toBeChecked();
    });
  });

  it('deletes a task when the delete button is clicked', async () => {
    let serverTasks = tasks.slice();

    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json(serverTasks),
      ),

      http.delete(
        'http://localhost:3001/tasks/:id',
        ({ params }) => {
          serverTasks = serverTasks.filter((task) => task.id !== params.id);

          return new HttpResponse(null, {
            status: 204,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );

    const taskItem = buyMilkCheckbox.closest('li');
    expect(taskItem).not.toBeNull();
    const deleteButton = within(taskItem!).getByRole('button', {
      name: 'Delete',
    });

    await user.click(deleteButton);

    await waitFor(() => expect(buyMilkCheckbox).not.toBeInTheDocument());

    const learnReactCheckbox = screen.getByRole(
      'checkbox',
      {
        name: 'Learn React',
      },
    );

    expect(learnReactCheckbox).toBeVisible();
  });

  it('deletes all tasks when the delete all tasks button is clicked', async () => {
    let serverTasks = tasks.slice();
    let countDeleteRequest = 0;

    server.use(
      http.get(
        'http://localhost:3001/tasks',
        () => HttpResponse.json(serverTasks),
      ),

      http.delete(
        'http://localhost:3001/tasks/:id',
        ({ params }) => {
          countDeleteRequest++;
          serverTasks = serverTasks.filter((task) => task.id !== params.id);

          return new HttpResponse(null, {
            status: 204,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const deleteAllButton = await screen.findByRole('button', { name: 'Delete all'});

    await user.click(deleteAllButton);

    const dialog = await screen.findByRole('alertdialog');
    const confirmButton = within(dialog).getByRole('button', { name: 'Delete all' });

    await user.click(confirmButton);

    const notFoundElement = await screen.findByText('No tasks');
    const button = screen.getByRole('button', { name: 'Show first incomplete task' });
    const listElement = screen.getByRole('list');

    await waitFor(() => expect(listElement.children.length).toBe(0));
    expect(notFoundElement).toBeVisible();
    expect(button).toBeDisabled();

    expect(countDeleteRequest).toBe(2);
  });

  it('keeps tasks when deleting all is cancelled', async () => {
    setupTasksHandler();

    let countDeleteRequest = 0;

    server.use(
      http.delete(
        'http://localhost:3001/tasks/:id',
        () => {
          countDeleteRequest++;

          return new HttpResponse(null, {
            status: 204,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
      </MemoryRouter>
    );

    const deleteAllButton = await screen.findByRole('button', { name: 'Delete all'});

    await user.click(deleteAllButton);

    const dialog = await screen.findByRole('alertdialog');
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(countDeleteRequest).toBe(0);

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );

    expect(buyMilkCheckbox).toBeVisible();

    const learnReactCheckbox = screen.getByRole(
      'checkbox',
      {
        name: 'Learn React',
      },
    );

    expect(learnReactCheckbox).toBeVisible();
    expect(learnReactCheckbox).toBeChecked();
  });

  it('keeps a task and shows an error when deleting fails', async () => {
    let countDeleteRequest = 0;

    setupTasksHandler();

    server.use(
      http.delete(
        'http://localhost:3001/tasks/:id',
        () => {
          countDeleteRequest++;

          return HttpResponse.json({}, {
            status: 500,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter>
        <Todo />
        <Toaster />
      </MemoryRouter>,
    );

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );
    const taskItem = buyMilkCheckbox.closest('li');

    expect(taskItem).not.toBeNull();

    const deleteButton = within(taskItem!).getByRole('button', {
      name: 'Delete',
    });

    await user.click(deleteButton);

    expect(
      await screen.findByText('The server is temporarily unavailable'),
    ).toBeVisible();
    expect(buyMilkCheckbox).toBeVisible();
    expect(countDeleteRequest).toBe(1);
  });

  it('opens the task detail page from the task list', async () => {
    let requestedTaskId: string | undefined;

    setupTasksHandler();

    server.use(
      http.get(
        'http://localhost:3001/tasks/:id',
        ({ params }) => {
          requestedTaskId = params.id as string;

          return HttpResponse.json<Task>({
            id: requestedTaskId,
            title: 'Buy milk',
            isDone: false,
          });
        },
      ),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const buyMilkCheckbox = await screen.findByRole(
      'checkbox',
      {
        name: 'Buy milk',
      },
    );
    const taskItem = buyMilkCheckbox.closest('li');

    expect(taskItem).not.toBeNull();

    const taskLink = within(taskItem!).getByRole('link', {
      name: 'Task detail page',
    });

    await user.click(taskLink);

    expect(
      await screen.findByRole('heading', { name: 'Buy milk' }),
    ).toBeVisible();
    expect(screen.getByText('Task is not done')).toBeVisible();
    expect(requestedTaskId).toBe('1');
  });
});
