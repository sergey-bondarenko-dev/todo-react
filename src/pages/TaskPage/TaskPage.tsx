import { useParams } from "react-router";
import { getTasksErrorMessage } from "@/entities/todo";
import { useGetTaskByIdQuery } from "@/entities/todo/api";
import Button from "@/shared/ui/Button";
import { skipToken } from "@reduxjs/toolkit/query";

const TaskPage = () => {
    const { id } = useParams<{ id: string }>();
    const {
        data: task,
        error,
        isError,
        isFetching,
        refetch,
    } = useGetTaskByIdQuery(id ?? skipToken);

    const isLoadingWithoutData = isFetching && task === undefined;
    const hasInitialError = isError && task === undefined;
    const isRefreshing = isFetching && task !== undefined;
    const hasBackgroundError = isError && task !== undefined;

    if (isLoadingWithoutData) {
        return <div role="status">Loading task...</div>;
    }

    if (hasInitialError) {
        return (
            <div role="alert" style={{ display: 'grid', gap: '12px' }}>
                <p>
                    {getTasksErrorMessage(error, 'Failed to load task')}
                </p>
                <Button onClick={() => void refetch()}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
        <div>
            {isRefreshing && (
                <div role="status">Updating task...</div>
            )}

            {hasBackgroundError && (
                <div role="status">
                    <p>
                        {getTasksErrorMessage(error, 'Failed to load task')}.
                        {' '}Showing previously loaded task.
                    </p>
                    <Button onClick={() => void refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            <h1>{task.title}</h1>
            <p>{task.isDone ? "Task is done" : "Task is not done"}</p>
        </div>
    );
}

export default TaskPage;
