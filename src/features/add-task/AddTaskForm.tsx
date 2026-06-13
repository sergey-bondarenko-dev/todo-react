import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { useState, type InputEvent, type SubmitEvent } from "react";
import { useTasksContext } from "@/entities/todo/model/useTasksContext";

type AddTaskFormProps = {
    styles: CSSModuleClasses
}

const AddTaskForm = ({ styles }: AddTaskFormProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const {
        addTask,
        newTaskTitleInputRef,
    } = useTasksContext();

    const [error, setError] = useState('');

    const clearTitle = newTaskTitle.trim();
    const isTitleEmpty = clearTitle.length === 0;

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isTitleEmpty) {
            addTask(clearTitle, () => setNewTaskTitle(''));
        }
    }

    const onInput = (event: InputEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
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
                disabled={isTitleEmpty}
            >
                Add
            </Button>
        </form>
    );
}

export default AddTaskForm;
