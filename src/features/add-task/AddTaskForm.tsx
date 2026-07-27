import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { useEffect, useRef, useState, type InputEvent, type SubmitEvent } from "react";
import { useAddTaskMutation } from "@/entities/todo/api";
import { getTasksErrorMessage } from "@/entities/todo";
import { toast } from "sonner";

type AddTaskFormProps = {
    styles: CSSModuleClasses;
    onTaskAdded: () => void;
}

const AddTaskForm = ({ styles, onTaskAdded }: AddTaskFormProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [validationError, setValidationError] = useState('');
    const [
        add,
        { isLoading: isAdding },
    ] = useAddTaskMutation();
    const newTaskTitleInputRef = useRef<HTMLInputElement>(null);

    const clearTitle = newTaskTitle.trim();
    const isTitleEmpty = clearTitle.length === 0;
    useEffect(() => {
        newTaskTitleInputRef.current?.focus();
    }, []);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isTitleEmpty || isAdding) {
            return;
        }

        try {
            await add(clearTitle).unwrap();

            setNewTaskTitle('');
            onTaskAdded();
            newTaskTitleInputRef.current?.focus();
        } catch (error) {
            toast.error(
                getTasksErrorMessage(error, 'Failed to add task'),
            );
        }
        
    }

    const onInput = (event: InputEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        const clearValue = value.trim();
        const hasOnlySpaces = clearValue.length === 0 && value.length > 0;

        setNewTaskTitle(value);
        setValidationError(hasOnlySpaces ? 'Title cannot be empty' : '');
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
                error={validationError}
                disabled={isAdding}
            />
            <Button 
                type="submit"
                className={styles.addButton}
                disabled={isTitleEmpty || isAdding}
            >
                {isAdding ? 'Adding...' : 'Add'}
            </Button>
        </form>
    );
}

export default AddTaskForm;
