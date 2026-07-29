// @vitest-environment jsdom

import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { Task } from '@/shared/api/tasks/type';
import { server } from '@/test/mocks/server';
import { renderWithProviders } from '@/test/renderWithProviders';
import TaskPage from './TaskPage';

const renderTaskPage = (path = '/tasks/1') => {
  return renderWithProviders(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/tasks/:id" element={<TaskPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('TaskPage', () => {
  it('renders an incomplete task loaded by the route id', async () => {
    let requestedId: string | undefined;

    server.use(
      http.get('http://localhost:3001/tasks/:id', ({ params }) => {
        requestedId = params.id as string;

        return HttpResponse.json<Task>({
          id: requestedId,
          title: 'Buy milk',
          isDone: false,
        });
      }),
    );

    renderTaskPage('/tasks/1');

    expect(
      await screen.findByRole('heading', { name: 'Buy milk' }),
    ).toBeVisible();
    expect(screen.getByText('Task is not done')).toBeVisible();
    expect(requestedId).toBe('1');
  });

  it('renders a completed task status', async () => {
    server.use(
      http.get('http://localhost:3001/tasks/:id', ({ params }) => {
        return HttpResponse.json<Task>({
          id: params.id as string,
          title: 'Learn React',
          isDone: true,
        });
      }),
    );

    renderTaskPage('/tasks/2');

    expect(
      await screen.findByRole('heading', { name: 'Learn React' }),
    ).toBeVisible();
    expect(screen.getByText('Task is done')).toBeVisible();
  });

  it('shows a not-found message when the task does not exist', async () => {
    server.use(
      http.get('http://localhost:3001/tasks/:id', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    renderTaskPage('/tasks/missing');

    expect(await screen.findByText('Task not found')).toBeVisible();
  });

  it('loads the task after retrying a failed request', async () => {
    server.use(
      http.get('http://localhost:3001/tasks/:id', () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    const user = userEvent.setup();

    renderTaskPage('/tasks/1');

    const alert = await screen.findByRole('alert');
    const retryButton = screen.getByRole('button', { name: 'Retry' });

    expect(alert).toHaveTextContent('The server is temporarily unavailable');

    server.use(
      http.get('http://localhost:3001/tasks/:id', ({ params }) => {
        return HttpResponse.json<Task>({
          id: params.id as string,
          title: 'Buy milk',
          isDone: false,
        });
      }),
    );

    await user.click(retryButton);

    expect(
      await screen.findByRole('heading', { name: 'Buy milk' }),
    ).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
