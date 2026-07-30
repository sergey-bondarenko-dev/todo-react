import type { Task } from "@/shared/api/tasks/type";

export const isTask = (value: unknown): value is Task => {
    return typeof value === 'object' && value !== null &&
        'id' in value && typeof value.id === 'string' &&
        'title' in value && typeof value.title === 'string' &&
        'isDone' in value && typeof value.isDone === 'boolean';
}
