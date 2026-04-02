import AddTaskForm from "./AddTaskForm";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./TodoInfo";
import TodoList from "./TodoList";

const Todo = () => {

    const tasks = [
        {
            id: 'task-1',
            title: 'Task 1',
            isDone: true,
        },
        {
            id: 'task-2',
            title: 'Task 2',
            isDone: false,
        },
    ];

    const deleteAllTasks = () => {
        console.log("Delete all tasks");
    }

    const deleteTask = (taskId) => {
        console.log(`delete task ${taskId}`);
    }

    const toggleTaskComplete = (taskId, isDone) => {
        console.log(`toggle task ${taskId} - ${isDone}`);
    }

    const filterTasks = (query) => {
        console.log(query);
    }

    const addTask = () => {
        console.log("add task");
    }

    return (
        <div className="todo">
            <h1 className="todo__title">To Do List</h1>
            <AddTaskForm addTask={addTask} />
            <SearchTaskForm onSearchInput={filterTasks} />
            <TodoInfo
                total={tasks.length}
                done={tasks.filter((task) => task.isDone).length}
                onDeleteAllButtonClick={deleteAllTasks}
            />
            <TodoList 
                tasks={tasks}
                onDeleteButtonClick={deleteTask}
                onTaskCompleteChange={toggleTaskComplete}
            />
        </div>
    );
}

export default Todo;
