import clsx from "clsx";
import { memo, type Ref } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { highlightCaseInsensitive } from "@/shared/utils/highlight";
import styles from './TodoItem.module.scss';
import { Link } from "react-router";
import { useDeleteTaskMutation, useToggleCompleteTaskMutation } from "../../api";
import { getTasksErrorMessage } from "../../lib/getTasksErrorMessage";
import { toast } from "sonner";

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

  const [
    deleteTask,
    { isLoading: isDeleting },
  ] = useDeleteTaskMutation();
  const [
    toggleComplete,
    { isLoading: isToggling },
  ] = useToggleCompleteTaskMutation();
  const shouldReduceMotion = useReducedMotion();

  const highlightedTitle = highlightCaseInsensitive(title, query);

  const deleteCurrentTask = async () => {
      try {
          await deleteTask(id).unwrap();
      } catch (error) {
          toast.error(
              getTasksErrorMessage(
                  error,
                  'Failed to delete task',
              ),
          );
      }
  };

  const toggleCurrentTask = async (nextIsDone: boolean) => {
      try {
          await toggleComplete({
              id,
              isDone: nextIsDone,
          }).unwrap();
      } catch (error) {
          toast.error(
              getTasksErrorMessage(
                  error,
                  'Failed to update task',
              ),
          );
      }
  };

  return (
      <m.li
        className={clsx(
          styles.root, 
          className, 
        )}
        ref={ref}
        initial={shouldReduceMotion ? false : { opacity: 0, height: 0, y: -12 }}
        animate={{ opacity: 1, height: "auto", x: 0, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, x: 24 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: "easeOut",
        }}
      >
        <input
          className={styles.checkbox}
          id={id}
          type="checkbox"
          checked={isDone}
          onChange={(event) => {
              void toggleCurrentTask(event.currentTarget.checked);
          }}
          disabled={isDeleting || isToggling}
          aria-busy={isToggling}
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
          disabled={isDeleting || isToggling}
          aria-busy={isDeleting}
          onClick={() => void deleteCurrentTask()}
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
      </m.li>
  );
}

export default memo(TodoItem);
