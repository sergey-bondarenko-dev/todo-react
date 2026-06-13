import { useEffect, useState } from "react";
import tasksApi from "@/shared/api/tasks";
import type { Task } from "@/shared/api/tasks/type";
import type { PageProps } from "@/app/routing/Router";

type TaskPageProps = PageProps;

const TaskPage = (props: TaskPageProps) => {
    const { params } = props;
    const id = params.id;

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTask(null);
        tasksApi.getById(id)
            .then((taskData) => {
                setTask(taskData);
                setHasError(false);
            })
            .catch(() => {
                setHasError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (hasError) {
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