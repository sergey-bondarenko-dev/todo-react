import Field from "../Field";
import Button from "../Button";
import { useContext, useState } from "react";
import { TasksContext } from "../../context/TasksContext";

const AddTaskForm = ({ styles }) => {
    const {
        addTask,
        newTaskTitle,
        setNewTaskTitle,
        newTaskTitleInputRef,
    } = useContext(TasksContext);

    const [error, setError] = useState('');

    const clearTitle = newTaskTitle.trim();
    const isTitleEmpty = clearTitle === 0;

    const onSubmit = (event) => {
        event.preventDefault();

        if (!isTitleEmpty) {
            addTask(clearTitle);
        }
    }

    const onInput = (event) => {
        const { value } = event.target;
        const clearValue = value.trim();
        const hasOnlySpaces = clearValue.length === 0 && value.length > 0;

        setNewTaskTitle(value);
        setError(hasOnlySpaces ? 'Title cannot be empty' : '');
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <Field 
                id="new-task" 
                label="New task title" 
                type="text" 
                className={styles.field}
                value={newTaskTitle}
                onInput={onInput}
                ref={newTaskTitleInputRef}
                error={error}
            />
            <Button 
                type="submit"
                isDisabled={isTitleEmpty}
            >
                Add
            </Button>
        </form>
    );
}

export default AddTaskForm;
