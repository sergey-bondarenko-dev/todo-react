import clsx from "clsx";

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
            <div className={clsx('field', className)}>
            <label
                className="field__label"
                htmlFor={id}
            >
                {label}
            </label>
            <input
                className={clsx('field__input', error ? 'is-invalid' : '')}
                id={id}
                placeholder=" "
                autoComplete="off"
                type={type}
                value={value}
                onInput={onInput}
                ref={ref}
            />
            {error && (
                <span className="field__error" title={error}>
                    {error}
                </span>
            )}
            </div>
        </>
    );
}

export default Field;
