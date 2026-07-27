import { useMemo, useRef, useState } from "react";
import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import TodoInfo from "@/features/stats";
import { getTasksErrorMessage, TodoList } from "@/entities/todo";
import { useGetTasksQuery } from "@/entities/todo/api";
import Button from "@/shared/ui/Button";
import Skeleton from "@/shared/ui/Skeleton";
import styles from './Todo.module.scss';

const Todo = () => {
    const { data, error, isError, isFetching, refetch } = useGetTasksQuery();
    const [query, setQuery] = useState('');
    const firstIncompleteTaskRef = useRef<HTMLLIElement>(null);

    const tasks = data ?? [];
    const hasInitialError = isError && data === undefined;
    const isLoadingWithoutData = isFetching && data === undefined;
    const hasBackgroundError = isError && data !== undefined;
    const isRefreshing = isFetching && data !== undefined;

    const filteredTasks = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return tasks.filter((task) => (
            task.title.toLowerCase().includes(normalizedQuery)
        ));
    }, [tasks, query]);

    const firstIncompleteTaskId = filteredTasks.find((task) => !task.isDone)?.id;

    const scrollToFirstIncompleteTask = () => {
        firstIncompleteTaskRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    return (
        <div className={styles.todo}>
            <h1 className={styles.title}>To Do List</h1>
            <AddTaskForm
                styles={styles}
                onTaskAdded={() => setQuery('')}
            />
            <SearchTaskForm
                styles={styles}
                query={query}
                onQueryChange={setQuery}
            />

            {isLoadingWithoutData && (
                <Skeleton className={styles.todoInfoSkeleton} />
            )}

            {!isLoadingWithoutData && !hasInitialError && (
                <TodoInfo styles={styles} tasks={tasks} />
            )}
            
            <Button onClick={scrollToFirstIncompleteTask} disabled={!firstIncompleteTaskId}>
                Show first incomplete task
            </Button>

            {isRefreshing && (
                <div className={styles.emptyMessage} role="status">
                    Updating tasks...
                </div>
            )}

            {hasBackgroundError && (
                <div className={styles.emptyMessage} role="status">
                    <p>
                        {getTasksErrorMessage(error, 'Failed to load tasks')}. Showing previously loaded tasks.
                    </p>

                    <Button onClick={() => void refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            {isLoadingWithoutData ? (
                <div className={styles.emptyMessage} role="status">
                    Loading...
                </div>
            ) : hasInitialError ? (
                <div className={styles.emptyMessage} role="alert">
                    <p>{getTasksErrorMessage(error, 'Failed to load tasks')}</p>

                    <Button onClick={() => void refetch()}>
                        Retry
                    </Button>
                </div>
            ) : (
                <TodoList
                    styles={styles}
                    tasks={filteredTasks}
                    hasAnyTasks={tasks.length > 0}
                    query={query}
                    firstIncompleteTaskId={firstIncompleteTaskId}
                    firstIncompleteTaskRef={firstIncompleteTaskRef}
                />
            )}
        </div>
    );
}

export default Todo;
