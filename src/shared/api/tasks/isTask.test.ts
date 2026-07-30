import { describe, expect, it } from "vitest";
import { isTask } from "./isTask";

describe('isTask', () => {
  it('returns true for a valid task', () => {
    expect(isTask({
      id: '1',
      title: 'Test task',
      isDone: false,
    })).toBe(true);
  });

  it.each([
    { name: 'null', value: null },
    { name: 'undefined', value: undefined },
    { name: 'string', value: 'task' },
    { name: 'number', value: 123 },
    { name: 'array', value: [] },
    { name: 'empty object', value: {} },
    {
      name: 'missing isDone',
      value: { id: '1', title: 'Task' },
    },
    {
      name: 'numeric id',
      value: { id: 1, title: 'Task', isDone: false },
    },
    {
      name: 'null title',
      value: { id: '1', title: null, isDone: false },
    },
    {
      name: 'string isDone',
      value: { id: '1', title: 'Task', isDone: 'false' },
    },
  ])('returns false for $name', ({ value }) => {
    expect(isTask(value)).toBe(false);
  });
});
