import { memo, type RefObject } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import type { Task } from "@/shared/api/tasks/type";
import TodoItem from "../TodoItem";

const loadMotionFeatures = () =>
    import("./motionFeatures").then(({ default: features }) => features);

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

    return (
        <>
            {!hasAnyTasks && (
                <div className={styles.emptyMessage}>No tasks</div>
            )}
            {hasAnyTasks && tasks.length === 0 && (
                <div className={styles.emptyMessage}>Not found</div>
            )}
            <ul className={styles.list}>
                <LazyMotion features={loadMotionFeatures} strict>
                    <AnimatePresence initial={false}>
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
                    </AnimatePresence>
                </LazyMotion>
            </ul>
        </>
    );
}

export default memo(TodoList);
