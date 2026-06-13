import type { MouseEvent, ReactNode } from "react";
import { buildAppPath } from "../../utils/url";

type RouterLinkProps = {
    to: string;
    children: ReactNode;
}

const RouterLink = (props: RouterLinkProps) => {
    const {
        to,
        children,
        ...rest
    } = props;

    const href = buildAppPath(to);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    return (
        <a href={href} onClick={handleClick} {...rest}>
            {children}
        </a>
    );
}

export default RouterLink;
