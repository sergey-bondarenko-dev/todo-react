import Field from "./Field";

const SearchTaskForm = () => {
    return (
        <form className="todo__form">
            <Field 
                className="todo__field"
                id="search-task"
                type="search"
                label="Search task"
            />
        </form>
    );
}

export default SearchTaskForm;
