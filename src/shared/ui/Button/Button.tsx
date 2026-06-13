import clsx from "clsx";
import styles from './Button.module.scss';
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
}

const Button = (props: ButtonProps) => {
    const {
        className,
        children,
        type = 'button',
        onClick,
        disabled: isDisabled,
    } = props;
    
    return (
        <button 
            className={clsx(styles.button, className)} 
            type={type}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
}

export default Button;
