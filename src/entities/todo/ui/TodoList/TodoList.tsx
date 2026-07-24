import { memo, type RefObject } from "react";
import type { Task } from "@/shared/api/tasks/type";
import TodoItem from "../TodoItem";

type TodoListProps = {
    styles: CSSModuleClasses;
    tasks: Task[];
    hasAnyTasks: boolean;
    query: string;
    firstIncompleteTaskId?: string;
    firstIncompleteTaskRef: RefObject<HTMLLIElement | null>;
}

const TodoList = (props: TodoListProps) => {
    const {
        styles,
        tasks,
        hasAnyTasks,
        query,
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
    } = props;

    if (!hasAnyTasks) {
        return <div className={styles.emptyMessage}>No tasks</div>;
    } else if (tasks.length === 0) {
        return <div className={styles.emptyMessage}>Not found</div>;
    }

    return (
        <ul className={styles.list}>
            {tasks.map(({ id, isDone, title }) => (
                <TodoItem 
                    id={id}
                    isDone={isDone}
                    title={title}
                    key={id}
                    query={query}
                    ref={id === firstIncompleteTaskId ? firstIncompleteTaskRef : null}
                />
            ))}
        </ul>
    );
}

export default memo(TodoList);
