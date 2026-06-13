import Field from "@/shared/ui/Field";
import { useTasksContext } from "@/entities/todo/model/useTasksContext";

type SearchTaskFormProps = {
    styles: CSSModuleClasses;
}

const SearchTaskForm = ({ styles }: SearchTaskFormProps) => {
    const {
        query,
        setQuery,
    } = useTasksContext();

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
                onInput={(event) => setQuery(event.currentTarget.value)}
            />
        </form>
    );
}

export default SearchTaskForm;
