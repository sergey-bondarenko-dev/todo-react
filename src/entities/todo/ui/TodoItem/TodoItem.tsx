import clsx from "clsx";
import { memo, type Ref } from "react";
import { highlightCaseInsensitive } from "@/shared/utils/highlight";
import styles from './TodoItem.module.scss';
import { Link } from "react-router-dom";
import { useDeleteTaskMutation, useToggleCompleteTaskMutation } from "../../api";

type TodoItemProps = {
  className?: string,
  id: string,
  title: string,
  isDone: boolean;
  query: string;
  ref?: Ref<HTMLLIElement>;
}

const TodoItem = (props: TodoItemProps) => {
  const {
    className = '',
    id,
    title,
    isDone,
    query,
    ref,
  } = props;

  const [deleteTask] = useDeleteTaskMutation();
  const [toggleComplete] = useToggleCompleteTaskMutation();

  const highlightedTitle = highlightCaseInsensitive(title, query);

  return (
      <li 
        className={clsx(
          styles.root, 
          className, 
        )}
        ref={ref}
      >
        <input
          className={styles.checkbox}
          id={id}
          type="checkbox"
          checked={isDone}
          onChange={(event) => {
            toggleComplete({ id, isDone: event.target.checked });
          }}
        />
        <label
          className={clsx(styles.label, 'visually-hidden')}
          htmlFor={id}
        >
          {title}
        </label>
        <Link
          to={`/tasks/${id}`}
          aria-label="Task detail page"
        >
          <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
        </Link>
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
