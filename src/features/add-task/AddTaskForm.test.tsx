// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddTaskForm from "./AddTaskForm";
import userEvent from "@testing-library/user-event";

const styles = {
  form: 'form',
  field: 'field',
  addButton: 'addButton',
};

const { addTaskMock, toastErrorMock } = vi.hoisted(() => ({
  addTaskMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('@/entities/todo/api', () => ({
  useAddTaskMutation: () => [
    addTaskMock,
    { isLoading: false },
  ],
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
  },
}));

beforeEach(() => {
  addTaskMock.mockReset();
  toastErrorMock.mockReset();
});

describe('AddTaskForm', () => {
  it('does not allow adding a title containing only spaces', async () => {
    const user = userEvent.setup();
    render(<AddTaskForm styles={styles} onTaskAdded={vi.fn()} />);

    const input = screen.getByRole('textbox', { name: 'New task title' });

    await user.type(input, '    ');

    expect(screen.getByText('Title cannot be empty')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('adds a trimmed task title and clears the form', async () => {
    addTaskMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(undefined),
    });

    const user = userEvent.setup();
    const onTaskAddedMock = vi.fn();

    render(<AddTaskForm styles={styles} onTaskAdded={onTaskAddedMock} />);

    const input = screen.getByRole('textbox', { name: 'New task title' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, '  Buy milk  ');
    await user.click(addButton);

    expect(addTaskMock).toHaveBeenCalledWith('Buy milk');

    await waitFor(() => {
      expect(input).toHaveValue('');
      expect(onTaskAddedMock).toHaveBeenCalledOnce();
    });
  });

  it('preserves the title and shows an error when adding fails', async () => {
    addTaskMock.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        type: 'network',
        message: 'Network request failed',
      }),
    });

    const user = userEvent.setup();
    const onTaskAddedMock = vi.fn();

    render(<AddTaskForm styles={styles} onTaskAdded={onTaskAddedMock} />);

    const input = screen.getByRole('textbox', { name: 'New task title' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'Buy milk');
    await user.click(addButton);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Unable to connect to the server',
      );
    });

    expect(input).toHaveValue('Buy milk');
    expect(onTaskAddedMock).not.toHaveBeenCalled();
  });
});
