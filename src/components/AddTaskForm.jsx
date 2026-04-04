import Field from "./Field";
import Button from "./Button";
import { useContext } from "react";
import { TasksContext } from "../context/TasksContext";

const AddTaskForm = () => {
    const {
        addTask,
        newTaskTitle,
        setNewTaskTitle,
        newTaskTitleInputRef,
    } = useContext(TasksContext);

    const onSubmit = (event) => {
        event.preventDefault();
        addTask();
    }

    return (
        <form className="todo__form" onSubmit={onSubmit}>
            <Field 
                id="new-task" 
                label="New task title" 
                type="text" 
                className="todo__field"
                value={newTaskTitle}
                onInput={(event) => setNewTaskTitle(event.target.value)}
                ref={newTaskTitleInputRef}
            />
            <Button type="submit">Add</Button>
        </form>
    );
}

export default AddTaskForm;
