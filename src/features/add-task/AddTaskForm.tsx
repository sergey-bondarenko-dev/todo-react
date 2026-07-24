import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { useEffect, useRef, useState, type InputEvent, type SubmitEvent } from "react";
import { useAddTaskMutation } from "@/entities/todo/api";

type AddTaskFormProps = {
    styles: CSSModuleClasses;
    onTaskAdded: () => void;
}

const AddTaskForm = ({ styles, onTaskAdded }: AddTaskFormProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [error, setError] = useState('');
    const [add] = useAddTaskMutation();
    const newTaskTitleInputRef = useRef<HTMLInputElement>(null);

    const clearTitle = newTaskTitle.trim();
    const isTitleEmpty = clearTitle.length === 0;
    useEffect(() => {
        newTaskTitleInputRef.current?.focus();
    }, []);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isTitleEmpty) {
            await add(clearTitle).unwrap();
            setNewTaskTitle('');
            onTaskAdded();
            newTaskTitleInputRef.current?.focus();
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
