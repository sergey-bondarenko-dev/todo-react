// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Field from "./Field";
import userEvent from "@testing-library/user-event";

describe('Field', () => {
  it('associates the label with the input', () => {
    render(<Field id="task-title" label="Task title" />);

    const input = screen.getByRole('textbox', {
      name: 'Task title',
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'task-title');
  });

  it('shows a validation error', () => {
    render(<Field error="Title cannot be empty" />);

    const errorElement = screen.getByText('Title cannot be empty');

    expect(errorElement).toBeVisible();
  });

  it('does not show a validation error when error is not provided', () => {
    render(<Field />);

    const errorElement = screen.queryByText('Title cannot be empty');

    expect(errorElement).not.toBeInTheDocument();
  });

  it('calls onInput when the user types text', async () => {
    const user = userEvent.setup();
    const handleInput = vi.fn();

    render(<Field label="Field" onInput={handleInput} id="field" />);

    const input = screen.getByRole('textbox', { name: 'Field' });

    await user.type(input, 'Buy milk');

    expect(input).toHaveValue('Buy milk');
    expect(handleInput).toHaveBeenCalled();
  });
});
