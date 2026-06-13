import type { Task } from "@/shared/api/tasks/type";
import { useCallback, useRef } from "react";

const useIncompleteTaskScroll = (filteredTasks: Task[]) => {
    const firstIncompleteTaskRef = useRef<HTMLLIElement>(null);
    const firstIncompleteTaskId = filteredTasks.find((task) => !task.isDone)?.id;
    
    const scrollToFirstIncompleteTask = useCallback(() => {
        firstIncompleteTaskRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }, []);

    return {
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
        scrollToFirstIncompleteTask,
    }
}

export default useIncompleteTaskScroll;