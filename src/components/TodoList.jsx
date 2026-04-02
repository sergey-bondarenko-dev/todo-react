import TodoItem from "./TodoItem";

const TodoList = (props) => {
    const {
        tasks = [],
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
                />
            ))}
        </ul>
    );
}

export default TodoList;
