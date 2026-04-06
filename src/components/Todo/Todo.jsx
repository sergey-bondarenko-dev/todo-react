import AddTaskForm from "../AddTaskForm";
import SearchTaskForm from "../SearchTaskForm";
import TodoInfo from "../TodoInfo";
import TodoList from "../TodoList";
import Button from "../Button";
import { useContext } from "react";
import { TasksContext } from "../../context/TasksContext";
import styles from './Todo.module.scss';

const Todo = () => {
    const { scrollToFirstIncompleteTask } = useContext(TasksContext);

    return (
        <div className={styles.todo}>
            <h1 className={styles.title}>To Do List</h1>
            <AddTaskForm styles={styles} />
            <SearchTaskForm styles={styles} />
            <TodoInfo styles={styles} />
            <Button onClick={scrollToFirstIncompleteTask}>
                Show first incomplete task
            </Button>
            <TodoList styles={styles} />
        </div>
    );
}

export default Todo;
