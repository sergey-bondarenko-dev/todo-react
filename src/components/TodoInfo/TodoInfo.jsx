import { memo, useContext , useMemo} from "react";
import { TasksContext } from "../../context/TasksContext";

const TodoInfo = ({ styles }) => {
    const {
        tasks,
        deleteAllTasks,
    } = useContext(TasksContext);

    const total = tasks.length;
    const hasTasks = total > 0;
    const doneTasks = useMemo(() => {
        return tasks.filter((task) => task.isDone).length;
    }, [tasks]);

    return (
        <div className={styles.info}>
            <div>
                Done {doneTasks} from {total} 
            </div>
            {hasTasks && (
                <button 
                    className={styles.deleteAllButton} 
                    type="button"
                    onClick={deleteAllTasks}
                >
                    Delete all
                </button>
            )}
        </div>
    );
}

export default memo(TodoInfo);
