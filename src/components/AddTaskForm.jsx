import Field from "./Field";
import Button from "./Button";

const AddTaskForm = () => {
    return (
        <form className="todo__form">
            <Field 
                id="new-task" 
                label="New task title" 
                type="text" 
                className="todo__field" 
            />
            <Button type="submit">Add</Button>
        </form>
    );
}

export default AddTaskForm;
