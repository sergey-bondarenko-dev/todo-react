
/**
 * @typedef {Object} ButtonProps
 * @property {string} className
 * @property {"submit"|"button"|"reset"} type
 */

import clsx from "clsx";

/**
 * @param {ButtonProps} props 
 */
const Button = (props) => {
    const {
        className,
        children,
        type = 'button',
        onClick,
        isDisabled,
    } = props;
    
    return (
        <button 
            className={clsx('button', className)} 
            type={type}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
}

export default Button;
