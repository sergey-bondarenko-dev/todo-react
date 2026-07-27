export {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useDeleteAllTasksMutation,
    useToggleCompleteTaskMutation,
} from "./tasksApi";

export type { TasksApiError } from './error';
