import clsx from "clsx";
import styles from './Field.module.scss';

/**
 * @typedef {Object} FieldProps
 * @property {string} id
 * @property {string} label
 * @property {"search"|"text"} type
 * @property {string?} className
 */

/**
 * @param {FieldProps} props 
 */
const Field = (props) => {
    const {
        id,
        label,
        type,
        className = '',
        onInput,
        value,
        ref,
        error,
    } = props;
    
    return (
        <>
            <div className={clsx(styles.field, className)}>
            <label
                className={styles.label}
                htmlFor={id}
            >
                {label}
            </label>
            <input
                className={clsx(styles.input, error ? styles.isInvalid : '')}
                id={id}
                placeholder=" "
                autoComplete="off"
                type={type}
                value={value}
                onInput={onInput}
                ref={ref}
            />
            {error && (
                <span className={styles.error} title={error}>
                    {error}
                </span>
            )}
            </div>
        </>
    );
}

export default Field;
