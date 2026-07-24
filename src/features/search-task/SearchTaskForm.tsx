import Field from "@/shared/ui/Field";

type SearchTaskFormProps = {
    styles: CSSModuleClasses;
    query: string;
    onQueryChange: (query: string) => void;
}

const SearchTaskForm = ({ styles, query, onQueryChange }: SearchTaskFormProps) => {
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
                onInput={(event) => onQueryChange(event.currentTarget.value)}
            />
        </form>
    );
}

export default SearchTaskForm;
