import { memo, useMemo} from "react";
import { useTasksContext } from "@/entities/todo/model/useTasksContext";

type TodoInfoProps = {
    styles: CSSModuleClasses;
}

const TodoInfo = ({ styles }: TodoInfoProps) => {
    const {
        tasks,
        deleteAllTasks,
    } = useTasksContext();

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
