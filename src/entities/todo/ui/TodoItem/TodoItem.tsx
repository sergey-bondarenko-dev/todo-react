import clsx from "clsx";
import { memo } from "react";
import RouterLink from "@/shared/ui/RouterLink";
import { highlightCaseInsensitive } from "@/shared/utils/highlight";
import { useTasksContext } from "../../model/useTasksContext";
import styles from './TodoItem.module.scss';

type TodoItemProps = {
  className?: string,
  id: string,
  title: string,
  isDone: boolean;
}

const TodoItem = (props: TodoItemProps) => {
  const {
    className = '',
    id,
    title,
    isDone,
  } = props;

  const {
    deleteTask,
    toggleTaskComplete,
    firstIncompleteTaskId,
    firstIncompleteTaskRef,
    disappearingTaskId,
    appearingTaskId,
    query,
  } = useTasksContext();

  const highlightedTitle = highlightCaseInsensitive(title, query);

  return (
      <li 
        className={clsx(
          styles.root, 
          className, 
          disappearingTaskId === id ? styles.isDisappearing : '',
          appearingTaskId === id ? styles.isAppearing : '',
        )}
        ref={id === firstIncompleteTaskId ? firstIncompleteTaskRef : null}
      >
        <input
          className={styles.checkbox}
          id={id}
          type="checkbox"
          checked={isDone}
          onChange={(event) => {
            toggleTaskComplete(id, event.target.checked)
          }}
        />
        <label
          className={clsx(styles.label, 'visually-hidden')}
          htmlFor={id}
        >
          {title}
        </label>
        <RouterLink
          to={`/tasks/${id}`}
          aria-label="Task detail page"
        >
          <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
        </RouterLink>
        <button
          className={styles.deleteButton}
          aria-label="Delete"
          title="Delete"
          onClick={() => deleteTask(id)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="#757575"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </li>
  );
}

export default memo(TodoItem);
