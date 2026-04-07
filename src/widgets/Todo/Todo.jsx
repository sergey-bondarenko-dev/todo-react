import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import TodoInfo from "@/features/stats";
import { TodoList} from "@/entities/todo";
import Button from "@/shared/ui/Button";
import { useContext } from "react";
import { TasksContext } from "@/entities/todo";
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
