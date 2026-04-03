import { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./TodoInfo";
import TodoList from "./TodoList";

const Todo = () => {

    const TASK_STORAGE_KEY = 'tasks';

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
    const [tasks, setTasks] = useState(() => {
        const data = localStorage.getItem(TASK_STORAGE_KEY);
        if (!data) {
            return initialTasks;
        }

        try {
            return JSON.parse(data);
        } catch {
            return initialTasks;
        }
    });
    const [query, setQuery] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(query.trim().toLowerCase())
    );

    useEffect(() => {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

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

    const addTask = () => {
        if (newTaskTitle.trim().length <= 0) {
            return;
        }

        const newTask = {
            id: crypto?.randomUUID() ?? Date.now().toString(),
            title: newTaskTitle,
            isDone: false,
        }

        setTasks((tasks) =>  [...tasks, newTask]);
        setNewTaskTitle('');
        setQuery('');
    }

    return (
        <div className="todo">
            <h1 className="todo__title">To Do List</h1>
            <AddTaskForm 
                addTask={addTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle} 
            />
            <SearchTaskForm 
                query={query}
                setQuery={setQuery}  
            />
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
