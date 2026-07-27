import { memo, useCallback, useMemo } from "react";
import { useDeleteAllTasksMutation } from "@/entities/todo/api";
import { toast } from 'sonner';
import { getTasksErrorMessage } from '@/entities/todo';
import { AlertDialog } from 'radix-ui';
import type { Task } from "@/shared/api/tasks/type";

type TodoInfoProps = {
    styles: CSSModuleClasses;
    tasks: Task[];
}

const TodoInfo = ({ styles, tasks }: TodoInfoProps) => {
    const [
        deleteAll,
        { isLoading: isDeletingAll },
    ] = useDeleteAllTasksMutation();

    const total = tasks.length;
    const hasTasks = total > 0;
    const doneTasks = useMemo(() => {
        return tasks.filter((task) => task.isDone).length;
    }, [tasks]);

    const deleteAllTasks = useCallback(async () => {
        try {
            await deleteAll(tasks).unwrap();
        } catch (error) {
            toast.error(
                getTasksErrorMessage(
                    error,
                    'Failed to delete tasks',
                ),
            );
        }
    }, [tasks, deleteAll]);

    return (
        <div className={styles.info}>
            <div>
                Done {doneTasks} from {total} 
            </div>
            {hasTasks && (
                <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                        <button
                            className={styles.deleteAllButton}
                            type="button"
                            disabled={isDeletingAll}
                            aria-busy={isDeletingAll}
                        >
                            {isDeletingAll ? 'Deleting...' : 'Delete all'}
                        </button>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                        <AlertDialog.Overlay
                            className={styles.dialogOverlay}
                        />

                        <AlertDialog.Content
                            className={styles.dialogContent}
                        >
                            <AlertDialog.Title
                                className={styles.dialogTitle}
                            >
                                Delete all tasks?
                            </AlertDialog.Title>

                            <AlertDialog.Description
                                className={styles.dialogDescription}
                            >
                                This action cannot be undone.
                            </AlertDialog.Description>

                            <div className={styles.dialogActions}>
                                <AlertDialog.Cancel asChild>
                                    <button
                                        className={styles.dialogCancelButton}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                </AlertDialog.Cancel>

                                <AlertDialog.Action asChild>
                                    <button
                                        className={styles.dialogConfirmButton}
                                        type="button"
                                        onClick={() => void deleteAllTasks()}
                                    >
                                        Delete all
                                    </button>
                                </AlertDialog.Action>
                            </div>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            )}
        </div>
    );
}

export default memo(TodoInfo);
