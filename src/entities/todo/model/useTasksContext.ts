import { useContext } from 'react';
import { TasksContext } from './TasksContext';

export const useTasksContext = () => {
    const context = useContext(TasksContext);

    if (context === null) {
        throw new Error('useTasksContext must be used within TasksProvider');
    }

    return context;
};