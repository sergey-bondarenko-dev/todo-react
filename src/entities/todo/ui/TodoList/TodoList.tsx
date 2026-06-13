import { memo } from "react";
import TodoItem from "../TodoItem";
import { useTasksContext } from "../../model/useTasksContext";

type TodoListProps = {
    styles: CSSModuleClasses;
}

const TodoList = ({ styles }: TodoListProps) => {
    const {
        tasks,
        filteredTasks,
    } = useTasksContext();

    const hasTask = tasks.length > 0;
    const isEmptyFilteredTasks = filteredTasks?.length <= 0;

    if (!hasTask) {
        return <div className={styles.emptyMessage}>No tasks</div>;
    } else if (isEmptyFilteredTasks) {
        return <div className={styles.emptyMessage}>Not found</div>;
    }

    return (
        <ul className={styles.list}>
            {(filteredTasks ?? tasks).map(({ id, isDone, title }) => (
                <TodoItem 
                    id={id}
                    isDone={isDone}
                    title={title}
                    key={id}
                />
            ))}
        </ul>
    );
}

export default memo(TodoList);
