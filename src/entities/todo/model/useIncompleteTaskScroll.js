import { useRef } from "react";

const useIncompleteTaskScroll = (filteredTasks) => {
    const firstIncompleteTaskRef = useRef(null);
    const firstIncompleteTaskId = filteredTasks.find((task) => !task.isDone)?.id;
    
    const scrollToFirstIncompleteTask = () => {
        firstIncompleteTaskRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }

    return {
        firstIncompleteTaskId,
        firstIncompleteTaskRef,
        scrollToFirstIncompleteTask,
    }
}

export default useIncompleteTaskScroll;