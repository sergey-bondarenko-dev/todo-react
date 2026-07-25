import { useParams } from "react-router";
import { useGetTaskByIdQuery } from "@/entities/todo/api";
import { skipToken } from "@reduxjs/toolkit/query";

const TaskPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: task, error, isLoading } = useGetTaskByIdQuery(id ?? skipToken);

    const hasError = !!error;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (hasError) {
        return <div>Task not found</div>;
    }

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
        <div>
            <h1>{task?.title}</h1>
            <p>{task?.isDone ? "Task is done" : "Task is not done"}</p>
        </div>
    );
}

export default TaskPage;
