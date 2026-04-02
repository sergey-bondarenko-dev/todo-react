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
                className="field__input"
                id={id}
                placeholder=" "
                autoComplete="off"
                type={type}
                onInput={onInput}
            />
            </div>
        </>
    );
}

export default Field;
