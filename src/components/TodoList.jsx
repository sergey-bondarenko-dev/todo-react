import TodoItem from "./TodoItem";

const TodoList = (props) => {
    const {
        tasks = [],
        onDeleteButtonClick,
        onTaskCompleteChange,
        filteredTasks,
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
    } = props;

    const hasTask = tasks.length > 0;
    const isEmptyFilteredTasks = filteredTasks?.length <= 0;

    if (!hasTask) {
        return <div className="todo__empty-message">No tasks</div>;
    } else if (isEmptyFilteredTasks) {
        return <div className="todo__empty-message">Not found</div>;
    }

    return (
        <ul className="todo__list">
            {(filteredTasks ?? tasks).map(({ id, isDone, title }) => (
                <TodoItem 
                    className="todo__item"
                    id={id}
                    isDone={isDone}
                    title={title}
                    key={id}
                    onDeleteButtonClick={onDeleteButtonClick}
                    onTaskCompleteChange={onTaskCompleteChange}
                    ref={id === firstIncompleteTaskId ? firstIncompleteTaskRef : null}
                />
            ))}
        </ul>
    );
}

export default TodoList;
