import clsx from "clsx";
import styles from './Skeleton.module.scss';

type SkeletonProps = {
    className?: string,
}

const Skeleton = (props: SkeletonProps) => {
    const {
        className,
    } = props;
    
    return (
        <div className={clsx(styles.skeleton, className)} aria-hidden="true"></div>
    );
}

export default Skeleton;
