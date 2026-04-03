import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./TodoInfo";
import TodoList from "./TodoList";

const Todo = () => {

    const initialTasks = [
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
    const [tasks, setTasks] = useState(initialTasks);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const deleteAllTasks = () => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) return;

        setTasks([]);
    }

    const deleteTask = (taskId) => {
        setTasks((tasks) => {
            return tasks.filter((task) => task.id !== taskId);
        });
    }

    const toggleTaskComplete = (taskId, isDone) => {
        setTasks((tasks) => {
            return tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        isDone,
                    }
                }

                return task;
            });
        });
    }

    const filterTasks = (query) => {
        setFilteredTasks(tasks.filter((task) => {
            return task.title.toLowerCase().includes(query.trim().toLowerCase())
        }));
    }

    const addTask = () => {
        if (newTaskTitle.trim().length <= 0) {
            return;
        }

        const newTask = {
            id: crypto?.randomUUID() ?? new Date.now().toString(),
            title: newTaskTitle,
            idDone: false,
        }

        setTasks((tasks) =>  [...tasks, newTask]);
        setNewTaskTitle('');
    }

    return (
        <div className="todo">
            <h1 className="todo__title">To Do List</h1>
            <AddTaskForm 
                addTask={addTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle} 
            />
            <SearchTaskForm onSearchInput={filterTasks} />
            <TodoInfo
                total={tasks.length}
                done={tasks.filter((task) => task.isDone).length}
                onDeleteAllButtonClick={deleteAllTasks}
            />
            <TodoList 
                tasks={tasks}
                filteredTasks={filteredTasks}
                onDeleteButtonClick={deleteTask}
                onTaskCompleteChange={toggleTaskComplete}
            />
        </div>
    );
}

export default Todo;
