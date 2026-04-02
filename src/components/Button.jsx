
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
    } = props;
    
    return (
        <button 
            className={clsx('button', className)} 
            type={type}
        >
            {children}
        </button>
    );
}

export default Button;
