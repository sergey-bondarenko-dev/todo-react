import { useContext } from "react";
import Field from "@/shared/ui/Field";
import { TasksContext } from "@/entities/todo";

const SearchTaskForm = ({ styles }) => {
    const {
        query,
        setQuery,
    } = useContext(TasksContext);

    return (
        <form 
            className={styles.form}
            onSubmit={(event) => event.preventDefault()}
        >
            <Field 
                className={styles.field}
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
