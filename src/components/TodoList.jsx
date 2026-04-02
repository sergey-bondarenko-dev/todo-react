import TodoItem from "./TodoItem";

const TodoList = (props) => {
    const {
        tasks = [],
        onDeleteButtonClick,
        onTaskCompleteChange,
    } = props;

    const hasTask = tasks.length > 0;

    if (!hasTask) {
        return <div className="todo__empty-message">Not found</div>;
    }

    return (
        <ul className="todo__list">
            {tasks.map(({ id, isDone, title }) => (
                <TodoItem 
                    className="todo__item"
                    id={id}
                    isDone={isDone}
                    title={title}
                    key={id}
                    onDeleteButtonClick={onDeleteButtonClick}
                    onTaskCompleteChange={onTaskCompleteChange}
                />
            ))}
        </ul>
    );
}

export default TodoList;
