// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from '@testing-library/user-event';
import Button from "./Button";

describe('Button', () => {
  it('renders children and uses button type by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button', { name: 'Click' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when button is disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} disabled>Click</Button>);
    const button = screen.getByRole('button', { name: 'Click' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
