import { useMemo, useRef, useState } from "react";
import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import TodoInfo from "@/features/stats";
import { TodoList } from "@/entities/todo";
import { useGetTasksQuery } from "@/entities/todo/api";
import Button from "@/shared/ui/Button";
import styles from './Todo.module.scss';
import Skeleton from "@/shared/ui/Skeleton";

const Todo = () => {
    const { data: tasks = [], isLoading } = useGetTasksQuery();
    const [query, setQuery] = useState('');
    const firstIncompleteTaskRef = useRef<HTMLLIElement>(null);

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

            {isLoading ? (
                <Skeleton className={styles.todoInfoSkeleton} />
            ) : (
                <TodoInfo styles={styles} tasks={tasks} />
            )}
            
            <Button onClick={scrollToFirstIncompleteTask} disabled={!firstIncompleteTaskId}>
                Show first incomplete task
            </Button>
            <TodoList
                styles={styles}
                tasks={filteredTasks}
                hasAnyTasks={tasks.length > 0}
                query={query}
                firstIncompleteTaskId={firstIncompleteTaskId}
                firstIncompleteTaskRef={firstIncompleteTaskRef}
                isLoading={isLoading}
            />
        </div>
    );
}

export default Todo;
