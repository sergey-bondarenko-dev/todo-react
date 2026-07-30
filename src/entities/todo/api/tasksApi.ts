import taskRepository from "@/shared/api/tasks";
import type { Task } from "@/shared/api/tasks/type";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { normalizeTasksApiError, type TasksApiError } from "./error";

export const tasksApi = createApi({
    reducerPath: "tasksApi",
    baseQuery: fakeBaseQuery<TasksApiError>(),
    tagTypes: ["Task"],

    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            queryFn: async () => {
                try {
                    const tasks = await taskRepository.getAll();

                    return { data: tasks };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            providesTags: (result) =>
                result 
                    ? [
                        { type: "Task", id: "LIST" },
                        ...result.map(({ id }) => ({ type: "Task" as const, id })),
                    ]
                    : [{ type: "Task", id: "LIST" }],
        }),
        getTaskById: builder.query<Task | null, string>({
            queryFn: async (id) => {
                try {
                    const task = await taskRepository.getById(id);

                    return { data: task };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            providesTags: (_result, _error, id) => [{ type: "Task", id }],
        }),
        addTask: builder.mutation<Task, string>({
            queryFn: async (title) => {
                try {
                    const data = await taskRepository.add(title);

                    return { data };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            onQueryStarted: async (
                _title,
                { dispatch, queryFulfilled },
            ) => {
                try {
                    const { data: createdTask } = await queryFulfilled;

                    dispatch(
                        tasksApi.util.updateQueryData(
                            'getTasks',
                            undefined,
                            (draft) => {
                                const taskExists = draft.some(
                                    ({ id }) => id === createdTask.id,
                                );

                                if (!taskExists) {
                                    draft.push(createdTask);
                                }
                            },
                        ),
                    );
                } catch {
                    return;
                }
            },
        }),
        deleteTask: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    await taskRepository.delete(id);

                    return { data: undefined };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            invalidatesTags: (_result, error, id) =>
                error
                    ? []
                    : [
                        { type: "Task", id },
                        { type: "Task", id: "LIST" },
                    ],
        }),
        deleteAllTasks: builder.mutation<void, Task[]>({
            queryFn: async (tasks) => {
                try {
                    await taskRepository.deleteAll(tasks);

                    return { data: undefined };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            invalidatesTags: (_result, error, tasks) => (
                error 
                    ? []
                    : [
                        { type: "Task", id: "LIST" },
                        ...(tasks
                            ? tasks.map(({ id }) => ({ type: "Task" as const, id }))
                            : []),
                    ]),
        }),
        toggleCompleteTask: builder.mutation<void, { id: string, isDone: boolean }>({
            queryFn: async ({ id, isDone }) => {
                try {
                    await taskRepository.toggleComplete(id, isDone);

                    return { data: undefined };
                } catch (error) {
                    return {
                        error: normalizeTasksApiError(error),
                    };
                }
            },
            invalidatesTags: (_result, error, { id }) => (
                error 
                    ? []
                    : [
                        { type: "Task", id },
                    ]),
            onQueryStarted: async (
                { id, isDone },
                { dispatch, queryFulfilled },
            ) => {
                const getTasksPatchResult = dispatch(
                    tasksApi.util.updateQueryData(
                        'getTasks',
                        undefined,
                        (draft) => {
                            const task = draft.find((item) => item.id === id);

                            if (task) {
                                task.isDone = isDone;
                            }
                        },
                    ),
                );

                const getTaskByIdPatchResult = dispatch(
                    tasksApi.util.updateQueryData(
                        'getTaskById',
                        id,
                        (draft) => {
                            if (draft) {
                                draft.isDone = isDone;
                            }
                        },
                    ),
                );

                try {
                    await queryFulfilled;
                } catch {
                    getTasksPatchResult.undo();
                    getTaskByIdPatchResult.undo();
                }
            },
        }),
    })
});

export const {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useDeleteAllTasksMutation,
    useToggleCompleteTaskMutation,
} = tasksApi;
