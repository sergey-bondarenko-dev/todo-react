import Field from "./Field";

const SearchTaskForm = (props) => {
    const {
        query,
        setQuery,
    } = props;

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
