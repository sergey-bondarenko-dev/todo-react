import { memo, useCallback, useMemo } from "react";
import { useDeleteAllTasksMutation } from "@/entities/todo/api";
import type { Task } from "@/shared/api/tasks/type";

type TodoInfoProps = {
    styles: CSSModuleClasses;
    tasks: Task[];
}

const TodoInfo = ({ styles, tasks }: TodoInfoProps) => {
    const [deleteAll] = useDeleteAllTasksMutation();

    const total = tasks.length;
    const hasTasks = total > 0;
    const doneTasks = useMemo(() => {
        return tasks.filter((task) => task.isDone).length;
    }, [tasks]);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        }

        deleteAll(tasks);
    }, [tasks, deleteAll]);

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
