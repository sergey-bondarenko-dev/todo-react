import { useContext } from "react";
import Field from "./Field";
import { TasksContext } from "../context/TasksContext";

const SearchTaskForm = () => {
    const {
        query,
        setQuery,
    } = useContext(TasksContext);

    return (
        <form 
            className="todo__form"
            onSubmit={(event) => event.preventDefault()}
        >
            <Field 
                className="todo__field"
                id="search-task"
                type="search"
                label="Search task"
                value={query}
                onInput={(event) => setQuery(event.target.value)}
            />
        </form>
    );
}

export default SearchTaskForm;
