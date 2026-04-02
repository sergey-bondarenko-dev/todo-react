import Field from "./Field";

const SearchTaskForm = (props) => {
    const {
        onSearchInput
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
                onInput={(event) => onSearchInput(event.target.value)}
            />
        </form>
    );
}

export default SearchTaskForm;
